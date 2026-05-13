import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpContext, httpResource, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseStore } from '@core/store/base.store';
import { IS_PUBLIC } from '@core/auth/context/auth.context';
import { environment } from '@env/environment';
import { OrderService } from '../services/order.service';
import { OrderClaimService } from '../services/order-claim.service';
import { OrderRefundService } from '../services/order-refund.service';
import { Order, OrderItem } from '../models/order.model';
import { OrderClaim } from '../models/order-claim.model';
import {
  orderFilterDefaults,
  type OrderFilter,
} from '../models/order-filter.model';
import type {
  CreateRefundPayload,
  UpdateLogisticsPayload,
  CreateClaimPayload,
  ReviewClaimPayload,
  CompleteRefundPayload,
  MarkClaimReceivedPayload,
  DeliverOrderPayload,
  ShipOrderPayload,
  CancelOrderPayload,
  ConfirmPaymentPayload,
  ConfirmReturnShipmentPayload,
  ReasonCategory,
} from '../models';
import type { ApiResponse } from '@core/models/api-response.model';
import * as U from '../utils/order-calculations.utils';

@Injectable({ providedIn: 'root' })
export class OrderStore extends BaseStore<Order, OrderFilter> {
  // ── Servicios ──────────────────────────────────────────
  protected readonly service = inject(OrderService);
  private readonly claimService = inject(OrderClaimService);
  private readonly refundService = inject(OrderRefundService);

  // ── Filtros ────────────────────────────────────────────
  override readonly filter = signal<OrderFilter>(orderFilterDefaults());

  // ── Estados de carga ───────────────────────────────────
  readonly isUpdatingStatus = signal(false);
  readonly isProcessingRefund = signal(false);
  readonly isUpdatingLogistics = signal(false);
  readonly isCreatingClaim = signal(false);
  readonly isUpdatingClaimStatus = signal(false);
  readonly isConfirmingPayment = signal(false);
  readonly isCancellingOrder = signal(false);
  readonly isMarkingDelivered = signal(false);

  // ── Loading del detalle ────────────────────────────────
  override readonly isDetailLoading = computed(
    () => !this.selected() && !!this.selectedId(),
  );

  /** Centralised loading state: true if ANY async operation is in progress */
  readonly isActionLoading = computed(
    () =>
      this.isUpdatingLogistics() ||
      this.isUpdatingStatus() ||
      this.isConfirmingPayment() ||
      this.isCancellingOrder() ||
      this.isMarkingDelivered() ||
      this.isUpdatingClaimStatus() ||
      this.isProcessingRefund() ||
      this.isCreatingClaim() ||
      this.isDetailLoading(),
  );

  // ── Centralised triggers ───────────────────────────────
  readonly claimsLastUpdated = signal<number>(0);

  public triggerClaimsReload(): void {
    this.claimsLastUpdated.update((v) => v + 1);
    this.activeClaimsResource.reload();
  }

  // ── Claims activos (badge sidebar y tabs) ──────────────
  private readonly activeClaimsResource = httpResource<
    ApiResponse<OrderClaim[]>
  >(() => {
    // Si no enviamos status, trae todos paginados. Podemos filtrar localmente o enviar solo PENDING si el count es muy alto.
    // Para contar los pendientes reales, pedimos sin status y contamos los locales activos:
    const params = new HttpParams().set('limit', '50');
    return {
      url: `${environment.apiUrl}/orders/claims`,
      context: new HttpContext().set(IS_PUBLIC, false),
      params,
    };
  });

  readonly activeClaimsCount = computed(() => {
    const data = this.activeClaimsResource.value()?.data ?? [];
    return data.filter(
      (c) =>
        c.status === 'PENDING' ||
        c.status === 'APPROVED' ||
        c.status === 'RECEIVED',
    ).length;
  });

  constructor() {
    super({ useSoftDelete: false });
  }

  // ═══════════════════════════════════════════════════════
  // COMPUTED SIGNALS BÁSICOS
  // ═══════════════════════════════════════════════════════

  readonly currentOrder = computed<Order | null>(
    () => this.selected() as Order | null,
  );
  readonly currentItems = computed<OrderItem[]>(
    () => this.currentOrder()?.items ?? [],
  );
  readonly currentClaims = computed<OrderClaim[]>(
    () => this.currentOrder()?.claims ?? [],
  );
  readonly hasActiveClaims = computed(() => this.currentClaims().length > 0);
  readonly currentLogistics = computed(
    () => this.currentOrder()?.logistics ?? null,
  );

  readonly statusLabel = computed(() => {
    const o = this.currentOrder();
    return o ? U.getStatusLabel(o.status) : '';
  });

  readonly statusSeverity = computed(() => {
    const o = this.currentOrder();
    return o ? U.getStatusSeverity(o.status) : 'secondary';
  });

  readonly orderProgress = computed(() => {
    const o = this.currentOrder();
    return o ? U.getOrderProgress(o.status) : 0;
  });

  readonly isTerminal = computed(() => {
    const o = this.currentOrder();
    return o ? U.isTerminalStatus(o.status) : false;
  });

  /** ¿Es una orden de reemplazo? */
  readonly isReplacement = computed(() => {
    const o = this.currentOrder();
    return o ? !!o.parentOrderId : false;
  });

  readonly parentOrderNumber = computed(() => {
    const order = this.currentOrder();
    if (!order?.parentOrderId) return '';

    // Extraer solo el número legible del ID
    // Si el ID es un UUID, buscar la orden padre en la lista
    const parentOrder = this.data().find((o) => o.id === order.parentOrderId);
    return parentOrder?.orderNumber ?? `ORD-${order.parentOrderId.slice(-12)}`;
  });

  // ═══════════════════════════════════════════════════════
  // CLIENTE Y PAGO
  // ═══════════════════════════════════════════════════════

  readonly customerName = computed(() => {
    const o = this.currentOrder();
    return o ? U.getCustomerName(o) : '';
  });

  readonly customerEmail = computed(() => {
    const o = this.currentOrder();
    return o ? U.getCustomerEmail(o) : undefined;
  });

  readonly isManualPayment = computed(() => {
    const o = this.currentOrder();
    return o ? U.isManualPayment(o) : false;
  });

  readonly isCashOnDelivery = computed(() => {
    const o = this.currentOrder();
    return o ? U.isCashOnDelivery(o) : false;
  });

  // ═══════════════════════════════════════════════════════
  // CANTIDADES DE ITEMS
  // ═══════════════════════════════════════════════════════

  readonly totalOriginalQuantity = computed(() => {
    const o = this.currentOrder();
    return o?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  });

  readonly totalCancelledQuantity = computed(() => {
    const o = this.currentOrder();
    if (!o?.items) return 0;
    return o.items.reduce(
      (sum, i) => sum + U.getCancelledQuantity(o.claims ?? [], i.id),
      0,
    );
  });

  readonly totalRefundedQuantity = computed(() => {
    const o = this.currentOrder();
    if (!o?.items) return 0;
    return o.items.reduce(
      (sum, i) => sum + U.getRefundedQuantity(o.claims ?? [], i.id),
      0,
    );
  });

  readonly totalReplacedQuantity = computed(() => {
    const o = this.currentOrder();
    if (!o?.items) return 0;
    return o.items.reduce(
      (sum, i) => sum + U.getReplacedQuantity(o.claims ?? [], i.id),
      0,
    );
  });

  readonly totalActiveQuantity = computed(
    () =>
      this.totalOriginalQuantity() -
      this.totalCancelledQuantity() -
      this.totalRefundedQuantity(),
  );

  readonly uniqueProductsCount = computed(
    () => this.currentOrder()?.items?.length ?? 0,
  );

  readonly hasQuantityModifications = computed(
    () => this.totalCancelledQuantity() > 0 || this.totalRefundedQuantity() > 0,
  );

  // ═══════════════════════════════════════════════════════
  // ITEMS ENRIQUECIDOS (PARA LA TABLA)
  // ═══════════════════════════════════════════════════════

  readonly enrichedItems = computed(() => {
    const o = this.currentOrder();
    console.log('o', o);
    if (!o?.items) return [];

    const claims = o.claims ?? [];

    return o.items.map((item) => {
      const cancelledQty = U.getCancelledQuantity(claims, item.id);
      const refundedQty = U.getRefundedQuantity(claims, item.id);
      const effectiveQty = Math.max(
        0,
        item.quantity - cancelledQty - refundedQty,
      );
      const isModified = effectiveQty !== item.quantity;
      const effectiveLineTotal = U.getEffectiveLineTotal(claims, item);
      const isTotalModified = effectiveLineTotal !== Number(item.lineTotal);

      return {
        ...item,
        originalQuantity: item.quantity,
        effectiveQuantity: effectiveQty,
        originalLineTotal: Number(item.lineTotal),
        effectiveLineTotal,
        isModified,
        isTotalModified,
        claimBadges: U.getItemClaimBadges(claims, item.id),
        claimDetails: U.getItemClaimDetailsForTable(claims, item),
      } as U.EnrichedOrderItem;
    });
  });

  // ═══════════════════════════════════════════════════════
  // TOTALES FINANCIEROS
  // ═══════════════════════════════════════════════════════

  readonly totalRefunded = computed(() => {
    const o = this.currentOrder();
    return o ? U.getTotalAlreadyRefunded(o) : 0;
  });

  readonly totalPendingRefund = computed(() => {
    const o = this.currentOrder();
    return o ? U.getTotalPendingRefund(o) : 0;
  });

  readonly adjustedSubtotal = computed(() => {
    const o = this.currentOrder();
    if (!o?.items) return 0;
    return this.isReplacement()
      ? o.total
      : o.items.reduce(
          (sum, item) => sum + U.getEffectiveLineTotal(o.claims ?? [], item),
          0,
        );
  });

  readonly totalAdjustments = computed(() => {
    const o = this.currentOrder();
    return o ? o.subtotal - this.adjustedSubtotal() : 0;
  });

  readonly adjustedGrandTotal = computed(() => {
    const o = this.currentOrder();
    if (!o) return 0;

    const dscto = this.isReplacement()
      ? 0
      : Number(o.discountAmount) + Number(o.couponDiscount);
    return (
      this.adjustedSubtotal() +
      Number(o.shippingAmount) +
      Number(o.taxAmount) -
      dscto
    );
  });

  readonly costOfGoods = computed(() => {
    const o = this.currentOrder();
    return o ? U.getCostOfGoods(o) : 0;
  });

  readonly totalShippingCost = computed(() => {
    const o = this.currentOrder();
    return o ? U.getTotalShippingCost(o) : 0;
  });

  readonly netProfit = computed(() => {
    const o = this.currentOrder();
    return o ? U.getNetProfit(o) : 0;
  });

  readonly profitMargin = computed(() => {
    const o = this.currentOrder();
    return o ? U.getProfitMargin(o) : 0;
  });

  // order.store.ts

  /** Total de envío reembolsado (customerVoucherAmount de claims) */
  readonly totalShippingRefunded = computed(() => {
    const order = this.currentOrder();
    if (!order?.refunds) return 0;

    return order.refunds
      .filter((r) => r.status === 'COMPLETED')
      .reduce((sum, refund) => {
        const claim = order.claims?.find((c) => c.id === refund.claimId);
        if (!claim) return sum;
        return sum + Number(claim.customerVoucherAmount ?? 0);
      }, 0);
  });

  /** Total de productos reembolsados (sin envío) */
  readonly totalProductRefunded = computed(() => {
    return this.totalRefunded() - this.totalShippingRefunded();
  });

  readonly totalActiveOrdersNet = computed(() => {
    const activeOrders = this.data().filter(
      (o) => !['cancelled'].includes(o.status) && o.paidAt !== null,
    );
    const total = activeOrders.reduce(
      (sum, o) => sum + (Number(o.total) - U.getTotalAlreadyRefunded(o)),
      0,
    );
    return U.formatCurrency(total);
  });

  // ═══════════════════════════════════════════════════════
  // ACCIONES DISPONIBLES
  // ═══════════════════════════════════════════════════════

  readonly availableActions = computed(() => {
    const o = this.currentOrder();
    if (!o) return [];
    return U.getAvailableActions(o).map((action) => ({
      label: action.label,
      icon: action.icon,
      severity: action.severity,
      actionType: action.action,
      action: () => this.executeAction(action.action),
      loading: this.getActionLoadingState(action.action),
    }));
  });

  // ═══════════════════════════════════════════════════════
  // EJECUCIÓN DE ACCIONES
  // ═══════════════════════════════════════════════════════

  executeAction(
    actionType: string,
    context?: {
      payload?: any;
      claim?: OrderClaim;
      refund?: any;
      orderId?: string;
      onSuccess?: () => void;
    },
  ): void {
    const id = context?.orderId ?? this.currentOrder()?.id;
    if (!id) return;

    const { claim, refund, onSuccess } = context ?? {};
    let payload = context?.payload;

    // ✅ Filtrar automáticamente el campo 'info' (solo para visualización)
    if (payload && typeof payload === 'object') {
      const { info, ...cleanPayload } = payload;
      payload = cleanPayload;
    }

    const handlers: Record<string, () => void> = {
      'mark-processing': () => this.markAsProcessing(id, onSuccess),
      'confirm-payment': () => {
        if (payload) this.confirmPayment(id, payload, onSuccess);
      },
      'cancel-order': () => {
        if (payload) this.cancelOrder(id, payload, onSuccess);
      },
      'ship-order': () => {
        if (payload) this.shipOrder(id, payload, onSuccess);
      },
      'deliver-order': () => {
        if (payload) this.markAsDelivered(id, payload, onSuccess);
      },
      'create-claim': () => {
        if (payload) this.createClaim(id, payload, onSuccess);
      },
      'review-claim': () => {
        if (claim && payload)
          this.updateClaimStatus(id, claim.id, payload, onSuccess);
      },
      'mark-received': () => {
        if (claim && payload)
          this.markClaimReceived(claim.id, payload, id, onSuccess);
      },
      'register-return-shipment': () => {
        if (claim && payload)
          this.registerReturnShipment(claim.id, payload, id, onSuccess);
      },
      'complete-refund': () => {
        if (claim && payload)
          this.completeRefund(claim.id, payload, id, onSuccess);
        else if (refund && payload)
          this.processRefund(refund.id, payload, onSuccess);
      },
      'complete-replacement': () => {
        if (claim) this.completeReplacement(claim.id, id, onSuccess);
      },
    };

    handlers[actionType]?.() ??
      console.warn('Acción no reconocida:', actionType);
  }

  getActionLoadingState(action: string): boolean {
    const map: Record<string, () => boolean> = {
      'mark-processing': () => this.isUpdatingStatus(),
      'confirm-payment': () => this.isConfirmingPayment(),
      'cancel-order': () => this.isCancellingOrder(),
      'ship-order': () => this.isUpdatingLogistics(),
      'deliver-order': () => this.isMarkingDelivered(),
      'create-claim': () => this.isCreatingClaim(),
      'complete-refund': () =>
        this.isUpdatingClaimStatus() || this.isProcessingRefund(),
      'mark-received': () => this.isUpdatingClaimStatus(),
      'register-return-shipment': () => this.isUpdatingClaimStatus(),
      'review-claim': () => this.isUpdatingClaimStatus(),
      'complete-replacement': () => this.isUpdatingClaimStatus(),
    };
    return map[action]?.() ?? false;
  }

  // ═══════════════════════════════════════════════════════
  // OPERACIONES HTTP
  // ═══════════════════════════════════════════════════════

  markAsProcessing(orderId: string, onSuccess?: () => void): void {
    if (this.isUpdatingStatus()) return;
    this.isUpdatingStatus.set(true);
    this.service
      .markAsProcessing(orderId)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingStatus.set(false);
          this.dialog.success(
            res.message || 'Pedido en preparación',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isUpdatingStatus.set(false),
      });
  }

  confirmPayment(
    orderId: string,
    payload: ConfirmPaymentPayload,
    onSuccess?: () => void,
  ): void {
    this.isConfirmingPayment.set(true);
    this.service
      .confirmPayment(orderId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isConfirmingPayment.set(false);
          this.dialog.success(
            res.message || 'Pago confirmado',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isConfirmingPayment.set(false),
      });
  }

  cancelOrder(
    orderId: string,
    payload: CancelOrderPayload,
    onSuccess?: () => void,
  ): void {
    const {
      isFullCancellation,
      reason,
      reasonDetail,
      adminNotes,
      items: selectedItems,
      refundMethod,
      refundAccountDetails,
    } = payload;

    // Mapa para traducir motivos de cancelación a categorías de reclamo
    const categoryMap: Record<string, ReasonCategory> = {
      customer_request: 'CUSTOMER_DECISION',
      no_payment: 'CUSTOMER_DECISION',
      no_stock: 'STORE_ERROR',
      fraud: 'STORE_ERROR',
      wrong_address: 'CUSTOMER_DECISION',
      damaged_in_warehouse: 'STORE_ERROR',
      other: 'CUSTOMER_DECISION',
    };

    const reasonCategory = categoryMap[reason] || 'CUSTOMER_DECISION';
    const finalDescription = `Motivo: ${reason}. ${reasonDetail || ''}`.trim();

    // Si es total, mandamos todos los items para que el backend detecte "isFullCancellation"
    let finalItems = selectedItems ?? [];

    if (isFullCancellation) {
      const order = this.data().find((o) => o.id === orderId);

      if (!order?.items) {
        this.dialog.error(
          'No se pudo obtener los productos de la orden',
          'Error',
        );
        return;
      }

      const claims = order.claims ?? [];

      finalItems = order.items
        .map((item) => {
          const cancelledQty = U.getCancelledQuantity(claims, item.id);
          const refundedQty = U.getRefundedQuantity(claims, item.id);
          const effectiveQty = Math.max(
            0,
            item.quantity - cancelledQty - refundedQty,
          );
          return { item, effectiveQty };
        })
        .filter(({ effectiveQty }) => effectiveQty > 0)
        .map(({ item, effectiveQty }) => ({
          orderItemId: item.id,
          quantity: effectiveQty,
        }));
    }

    if (!finalItems.length) {
      this.dialog.error(
        'Debes seleccionar al menos un producto para cancelar',
        'Error de validación',
      );
      return;
    }

    this.isCreatingClaim.set(true);
    this.claimService
      .createClaim(orderId, {
        type: 'CANCELLATION',
        reasonCategory,
        description: finalDescription,
        adminNotes: adminNotes || '',
        items: finalItems,
        autoApprove: true,
        // ✅ Si hay datos de reembolso, incluirlos
        ...(refundMethod && { refundMethod }),
        ...(refundAccountDetails && { refundAccountDetails }),
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.isCreatingClaim.set(false);
          this.dialog.success(
            isFullCancellation
              ? 'Pedido cancelado totalmente'
              : 'Cancelación parcial procesada',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.reloadActive();
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isCreatingClaim.set(false),
      });
  }

  shipOrder(
    orderId: string,
    payload: ShipOrderPayload,
    onSuccess?: () => void,
  ): void {
    this.isUpdatingLogistics.set(true);
    this.service
      .shipOrder(orderId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingLogistics.set(false);
          this.dialog.success(
            res.message || 'Pedido enviado',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isUpdatingLogistics.set(false),
      });
  }

  markAsDelivered(
    orderId: string,
    payload: DeliverOrderPayload,
    onSuccess?: () => void,
  ): void {
    this.isMarkingDelivered.set(true);
    this.service
      .markAsDelivered(orderId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isMarkingDelivered.set(false);
          this.dialog.success(
            res.message || 'Entrega confirmada',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isMarkingDelivered.set(false),
      });
  }

  createClaim(
    orderId: string,
    payload: CreateClaimPayload,
    onSuccess?: () => void,
  ): void {
    this.isCreatingClaim.set(true);
    this.claimService
      .createClaim(orderId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isCreatingClaim.set(false);
          this.dialog.success(
            res.message ?? 'Reclamo creado',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isCreatingClaim.set(false),
      });
  }

  updateClaimStatus(
    orderId: string,
    claimId: string,
    payload: ReviewClaimPayload,
    onSuccess?: () => void,
  ): void {
    this.isUpdatingClaimStatus.set(true);
    this.claimService
      .reviewClaim(claimId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingClaimStatus.set(false);
          this.dialog.success(
            res.message ?? 'Reclamo actualizado',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isUpdatingClaimStatus.set(false),
      });
  }

  markClaimReceived(
    claimId: string,
    payload: MarkClaimReceivedPayload,
    orderId: string,
    onSuccess?: () => void,
  ): void {
    this.isUpdatingClaimStatus.set(true);
    this.claimService
      .markClaimReceived(claimId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingClaimStatus.set(false);
          this.dialog.success(
            res.message || 'Recepción registrada',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isUpdatingClaimStatus.set(false),
      });
  }

  completeRefund(
    claimId: string,
    payload: CompleteRefundPayload,
    orderId: string,
    onSuccess?: () => void,
  ): void {
    if (this.isUpdatingClaimStatus()) return;
    this.isUpdatingClaimStatus.set(true);
    this.claimService
      .completeRefund(claimId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingClaimStatus.set(false);
          this.dialog.success(
            res.message || 'Reembolso procesado',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.reloadActive();
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isUpdatingClaimStatus.set(false),
      });
  }

  completeReplacement(
    claimId: string,
    orderId: string,
    onSuccess?: () => void,
  ): void {
    if (this.isUpdatingClaimStatus()) return;
    this.isUpdatingClaimStatus.set(true);
    this.claimService
      .completeReplacement(claimId)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingClaimStatus.set(false);
          this.dialog.success(
            res.message || 'Reemplazo generado',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.reloadActive();
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isUpdatingClaimStatus.set(false),
      });
  }

  processRefund(
    refundId: string,
    payload: CompleteRefundPayload,
    onSuccess?: () => void,
  ): void {
    this.isProcessingRefund.set(true);
    this.refundService
      .processRefund(refundId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isProcessingRefund.set(false);
          this.dialog.success(
            res.message || 'Reembolso procesado',
            'Operación exitosa',
          );
          if (this.selectedId()) this.refreshOrder(this.selectedId()!);
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isProcessingRefund.set(false),
      });
  }

  registerReturnShipment(
    claimId: string,
    payload: ConfirmReturnShipmentPayload,
    orderId: string,
    onSuccess?: () => void,
  ): void {
    this.isUpdatingClaimStatus.set(true);
    this.claimService
      .registerReturnShipment(claimId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingClaimStatus.set(false);
          this.dialog.success(
            res.message || 'Envío registrado',
            'Operación exitosa',
          );
          this.refreshOrder(orderId);
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isUpdatingClaimStatus.set(false),
      });
  }

  updateLogistics(
    id: string,
    payload: UpdateLogisticsPayload,
    onSuccess?: () => void,
  ): void {
    this.isUpdatingLogistics.set(true);
    this.service
      .updateLogistics(id, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingLogistics.set(false);
          this.dialog.success(
            res.message ?? 'Logística actualizada',
            'Operación exitosa',
          );
          this.refreshOrder(id);
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isUpdatingLogistics.set(false),
      });
  }

  createRefund(
    id: string,
    payload: CreateRefundPayload,
    onSuccess?: () => void,
  ): void {
    this.isProcessingRefund.set(true);
    this.service
      .createRefund(id, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isProcessingRefund.set(false);
          this.dialog.success(
            res.message ?? 'Devolución procesada',
            'Devolución registrada',
          );
          this.refreshOrder(id);
          this.reloadActive();
          this.triggerClaimsReload();
          onSuccess?.();
        },
        error: () => this.isProcessingRefund.set(false),
      });
  }

  // ═══════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════

  private refreshOrder(orderId: string): void {
    if (this.selectedId() === orderId) this.getById(orderId);
  }

  override reload(): void {
    super.reload();
    this.triggerClaimsReload();
  }

  // Mantener compatibilidad con listado
  readonly countByStatus = computed(() => {
    return this.data().reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  });

  // Utilidad para pre-cargar datos pesados sin alterar el selector 'selected' nativo
  async getOrderDetailAsync(orderId: string): Promise<Order | null> {
    try {
      const res = await firstValueFrom(this.service.findOne(orderId));
      return res?.data ?? null;
    } catch (e) {
      console.error('Error pre-cargando detalle de la orden:', e);
      return null;
    }
  }
}
