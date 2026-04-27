import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

// Componentes del módulo
import { OrderStore } from '../../store/order.store';
import { OrderStatusDialogComponent } from '../../components/order-status-dialog/order-status-dialog.component';
import { OrderLogisticsDialogComponent } from '../../components/order-logistics-dialog/order-logistics-dialog.component';
import { OrderClaimDialogComponent } from '../../components/order-claim-dialog/order-claim-dialog.component';
import { OrderClaimReviewDialogComponent } from '../../components/order-claim-review-dialog/order-claim-review-dialog.component';

// Modelos
import {
  Order,
  OrderStatusHistory,
  getCustomerName,
  ORDER_STATUS_LABELS,
  VALID_TRANSITIONS,
} from '../../models';
import type {
  UpdateOrderStatusPayload,
  UpdateLogisticsPayload,
  DeliverOrderPayload,
  CancelOrderPayload,
  ConfirmPaymentPayload,
  CompleteRefundPayload,
  MarkClaimReceivedPayload,
  OrderRefund,
} from '../../models/';
import {
  OrderClaim,
  CreateClaimPayload,
  ReviewClaimPayload,
  CLAIM_TYPE_LABELS,
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_SEVERITY,
} from '../../models/order-claim.model';
import { DELIVERY_TYPE_LABELS } from '../../models/order-logistics.model';
import { environment } from '@env/environment';
import { ConfirmPaymentDialogComponent } from '../../components/confirm-payment-dialog/confirm-payment-dialog.component';
import { CancelOrderDialogComponent } from '../../components/cancel-order-dialog/cancel-order-dialog.component';
import { DeliverOrderDialogComponent } from '../../components/deliver-order-dialog/deliver-order-dialog.component';
import { MarkClaimReceivedDialogComponent } from '../../components/mark-claim-received-dialog/mark-claim-received-dialog.component';
import { CompleteRefundDialogComponent } from '../../components/complete-refund-dialog/complete-refund-dialog.component';
import { OrderStatus } from '../../models/orders.enum';
import { DialogService } from '@shared/services/ui/dialog.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    TagModule,
    TableModule,
    TimelineModule,
    TooltipModule,
    SkeletonModule,
    OrderStatusDialogComponent,
    OrderLogisticsDialogComponent,
    OrderClaimDialogComponent,
    OrderClaimReviewDialogComponent,
    ConfirmPaymentDialogComponent,
    CancelOrderDialogComponent,
    DeliverOrderDialogComponent,
    MarkClaimReceivedDialogComponent,
    CompleteRefundDialogComponent,
  ],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  readonly id = input.required<string>();
  readonly store = inject(OrderStore);
  readonly router = inject(Router);
  readonly dialog = inject(DialogService);

  // ── Estado de diálogos ─────────────────────────────────────
  protected readonly statusDialogVisible = signal(false);
  protected readonly logisticsDialogVisible = signal(false);
  protected readonly claimDialogVisible = signal(false);
  protected readonly claimReviewDialogVisible = signal(false);
  protected readonly confirmPaymentDialogVisible = signal(false);
  protected readonly cancelOrderDialogVisible = signal(false);
  protected readonly shipOrderDialogVisible = signal(false);
  protected readonly deliverOrderDialogVisible = signal(false);
  protected readonly markClaimReceivedDialogVisible = signal(false);
  protected readonly completeRefundDialogVisible = signal(false);
  protected readonly isCardForRefund = signal(false);
  protected readonly paymentMethodForRefund = signal<string | null>(null);
  //protected readonly processRefundDialogVisible = signal(false);
  //protected readonly selectedRefund = signal<OrderRefund | null>(null);

  // ── Reclamación seleccionada para revisión ─────────────────
  protected readonly selectedClaimForReview = signal<OrderClaim | null>(null);
  protected readonly selectedClaimForAction = signal<OrderClaim | null>(null);
  protected readonly selectedRefundForAction = signal<OrderRefund | null>(null);

  // ── Datos del pedido ───────────────────────────────────────
  protected readonly order = computed<Order | null>(
    () => this.store.selected() as Order | null,
  );
  protected readonly isLoading = computed(
    () => !this.order() && !!this.store.selectedId(),
  );

  // ── Relaciones del pedido ──────────────────────────────────
  protected readonly logistics = computed(
    () => this.order()?.logistics ?? null,
  );
  protected readonly claims = computed(() => this.order()?.claims ?? []);
  protected readonly hasClaims = computed(() => this.claims().length > 0);

  // ── Labels y constantes expuestas al template ──────────────
  protected readonly ORDER_STATUS_LABELS = ORDER_STATUS_LABELS;
  protected readonly DELIVERY_TYPE_LABELS = DELIVERY_TYPE_LABELS;
  protected readonly CLAIM_TYPE_LABELS = CLAIM_TYPE_LABELS;
  protected readonly CLAIM_STATUS_LABELS = CLAIM_STATUS_LABELS;
  protected readonly CLAIM_STATUS_SEVERITY = CLAIM_STATUS_SEVERITY;
  protected readonly getCustomerName = getCustomerName;

  // ── Permisos y visibilidad de botones ──────────────────────
  protected readonly canChangeStatus = computed(() => {
    const o = this.order();
    if (!o) return false;
    return VALID_TRANSITIONS[o.status].length > 0;
  });

  protected readonly canManageClaims = computed(() => {
    const o = this.order();
    if (!o) return false;
    // Solo se pueden crear reclamaciones en pedidos pagados o posteriores
    return ['paid', 'processing', 'shipped', 'delivered'].includes(o.status);
  });

  protected readonly canManageLogistics = computed(() => {
    const o = this.order();
    if (!o) return false;
    // Solo pedidos que están en proceso de envío o posteriores
    return ['processing', 'shipped', 'delivered'].includes(o.status);
  });

  // ── Cálculos financieros ───────────────────────────────────
  protected readonly totalAlreadyRefunded = computed(() => {
    const o = this.order();
    if (!o?.refunds) return 0;
    return o.refunds.reduce((sum, r) => sum + Number(r.totalRefunded), 0);
  });

  protected readonly netProfit = computed(() => {
    const o = this.order();
    if (!o) return 0;

    const total = Number(o.total);
    const costOfGoods = (o.items ?? []).reduce(
      (sum, item) => sum + Number(item.unitCost ?? 0) * item.quantity,
      0,
    );
    const actualShipping = Number(o.logistics?.actualShippingCost ?? 0);
    const internalTransport = Number(o.logistics?.internalTransportCost ?? 0);

    // Sumar vouchers de reclamaciones donde la tienda asume el costo
    const extraRefunds = (o.claims ?? [])
      .filter(
        (c) =>
          c.reasonCategory === 'STORE_ERROR' ||
          c.reasonCategory === 'PRODUCT_FAULT',
      )
      .reduce((sum, c) => sum + Number(c.customerVoucherAmount ?? 0), 0);

    return (
      total - costOfGoods - actualShipping - internalTransport - extraRefunds
    );
  });

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  readonly availableActions = computed(() => {
    const o = this.order();
    if (!o) return [];

    const actions: Array<{
      label: string;
      icon: string;
      severity:
        | 'success'
        | 'info'
        | 'warn'
        | 'danger'
        | 'secondary'
        | 'primary';
      action: () => void;
      loading?: boolean;
    }> = [];

    const paymentMethod = o.paymentMethod;
    const isManualPayment =
      paymentMethod?.type === 'wallet' || paymentMethod?.type === 'cash_code';

    switch (o.status) {
      case 'pending_payment':
        if (isManualPayment) {
          actions.push({
            label: 'Confirmar pago',
            icon: 'pi pi-check-circle',
            severity: 'success',
            action: () => this.confirmPaymentDialogVisible.set(true),
            loading: this.store.isConfirmingPayment(),
          });
        }
        actions.push({
          label: 'Cancelar pedido',
          icon: 'pi pi-times-circle',
          severity: 'danger',
          action: () => this.cancelOrderDialogVisible.set(true),
          loading: this.store.isCancellingOrder(),
        });
        break;

      case 'paid':
        actions.push({
          label: 'Preparar pedido',
          icon: 'pi pi-package',
          severity: 'warn',
          action: () => this.markAsProcessing(),
          loading: this.store.isUpdatingStatus(),
        });
        actions.push({
          label: 'Cancelar pedido',
          icon: 'pi pi-times-circle',
          severity: 'danger',
          action: () => this.cancelOrderDialogVisible.set(true),
          loading: this.store.isCancellingOrder(),
        });
        break;

      case 'processing':
        actions.push({
          label: 'Enviar pedido',
          icon: 'pi pi-truck',
          severity: 'primary',
          action: () => this.openLogisticsDialog(), // Reutiliza el diálogo existente
          loading: this.store.isUpdatingLogistics(),
        });
        actions.push({
          label: 'Cancelar pedido',
          icon: 'pi pi-times-circle',
          severity: 'danger',
          action: () => this.cancelOrderDialogVisible.set(true),
          loading: this.store.isCancellingOrder(),
        });
        break;

      case 'shipped':
        actions.push({
          label: 'Confirmar entrega',
          icon: 'pi pi-check',
          severity: 'success',
          action: () => this.deliverOrderDialogVisible.set(true),
          loading: this.store.isMarkingDelivered(),
        });
        actions.push({
          label: 'Editar logística',
          icon: 'pi pi-pencil',
          severity: 'secondary',
          action: () => this.openLogisticsDialog(),
        });
        break;

      case 'delivered':
        break;
      case 'cancelled':
        // ✅ Si el pedido fue pagado y tiene un reembolso PENDING, mostrar botón para procesar
        if (o.paidAt && hasPendingRefund(o)) {
          actions.push({
            label: 'Procesar reembolso',
            icon: 'pi pi-money-bill',
            severity: 'warn',
            action: () => this.openProcessRefundForCancellation(o),
          });
        }
        break;
      case 'refunded':
        // Sin acciones de cambio de estado
        break;
    }

    // Acción común: Nueva reclamación
    if (['paid', 'processing', 'shipped', 'delivered'].includes(o.status)) {
      actions.push({
        label: 'Nueva reclamación',
        icon: 'pi pi-exclamation-circle',
        severity: 'secondary',
        action: () => this.openClaimDialog(),
        loading: this.store.isCreatingClaim(),
      });
    }

    return actions;
  });

  // ── Helpers de UI ──────────────────────────────────────────
  protected getProductImageUrl(url?: string): string {
    if (!url) return 'assets/images/placeholder.png';
    return url.startsWith('http') ? url : `${environment.apiImagesUrl}${url}`;
  }

  protected getStatusLabel(status: OrderStatus): string {
    return this.ORDER_STATUS_LABELS[status] ?? status;
  }

  protected getRefundedQuantity(item: any): number {
    if (!item.refundItems?.length) return 0;
    return item.refundItems.reduce(
      (sum: number, ri: any) => sum + ri.quantity,
      0,
    );
  }

  protected statusSeverity(
    status: OrderStatus,
  ): 'warn' | 'success' | 'info' | 'secondary' | 'danger' | 'contrast' {
    const map: Record<OrderStatus, string> = {
      pending_payment: 'warn',
      paid: 'success',
      processing: 'info',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'contrast',
    };
    return (map[status] as any) ?? 'secondary';
  }

  // ── Lógica del Timeline ────────────────────────────────────
  protected getTimelineLabel(event: OrderStatusHistory): string {
    // Detectar devoluciones parciales (registradas con fromStatus === toStatus)
    if (event.fromStatus === event.toStatus) {
      const c = event.comment?.toLowerCase() ?? '';
      if (c.includes('devolución')) return 'Devolución registrada';
      if (c.includes('reclamación')) return 'Reclamación creada';
      return `${this.ORDER_STATUS_LABELS[event.toStatus]} (actualización)`;
    }
    return this.ORDER_STATUS_LABELS[event.toStatus] ?? event.toStatus;
  }

  protected getTimelineSeverity(
    event: OrderStatusHistory,
  ): 'warn' | 'success' | 'info' | 'secondary' | 'danger' | 'contrast' {
    if (event.fromStatus === event.toStatus) return 'contrast';
    return this.statusSeverity(event.toStatus);
  }

  protected getTimelineColor(event: OrderStatusHistory): string {
    if (event.fromStatus === event.toStatus) return '#8b5cf6'; // Púrpura para eventos especiales
    const colors: Record<OrderStatus, string> = {
      pending_payment: '#f59e0b',
      paid: '#22c55e',
      processing: '#3b82f6',
      shipped: '#6b7280',
      delivered: '#22c55e',
      cancelled: '#ef4444',
      refunded: '#8b5cf6',
    };
    return colors[event.toStatus] ?? '#94a3b8';
  }

  // ── Acciones de Estado del Pedido ──────────────────────────
  protected openStatusDialog(): void {
    this.statusDialogVisible.set(true);
  }

  protected onStatusChange(payload: UpdateOrderStatusPayload): void {
    const order = this.order();
    if (!order) return;

    this.store.updateStatus(order.id as string, payload, () => {
      this.statusDialogVisible.set(false);
      this.store.getById(order.id as string);
    });
  }

  // ── Acciones de Logística ──────────────────────────────────
  protected openLogisticsDialog(): void {
    this.logisticsDialogVisible.set(true);
  }

  protected onLogisticsSave(payload: UpdateLogisticsPayload): void {
    const order = this.order();
    if (!order) return;

    this.store.updateLogistics(order.id as string, payload, () => {
      this.logisticsDialogVisible.set(false);
      this.store.getById(order.id as string);
    });
  }

  // ── Acciones de Reclamaciones ──────────────────────────────
  protected openClaimDialog(): void {
    this.claimDialogVisible.set(true);
  }

  protected onClaimSave(payload: CreateClaimPayload): void {
    const order = this.order();
    if (!order) return;

    this.store.createClaim(order.id as string, payload, () => {
      this.claimDialogVisible.set(false);
      this.store.getById(order.id as string);
    });
  }

  protected openClaimReviewDialog(claim: OrderClaim): void {
    this.selectedClaimForReview.set(claim);
    this.claimReviewDialogVisible.set(true);
  }

  protected onClaimReview(payload: ReviewClaimPayload): void {
    const order = this.order();
    const claim = this.selectedClaimForReview();
    if (!order || !claim) return;

    this.store.updateClaimStatus(order.id as string, claim.id, payload, () => {
      this.claimReviewDialogVisible.set(false);
      this.selectedClaimForReview.set(null);
      this.store.getById(order.id as string);
    });
  }

  protected markAsProcessing(): void {
    const o = this.order();
    if (!o) return;

    this.store.markAsProcessing(o.id as string, () => {
      this.store.getById(o.id as string);
    });
  }

  protected onConfirmPayment(payload: ConfirmPaymentPayload): void {
    const o = this.order();
    if (!o) return;

    this.store.confirmPayment(o.id as string, payload, () => {
      this.confirmPaymentDialogVisible.set(false);
      this.store.getById(o.id as string);
    });
  }

  protected onCancelOrder(payload: CancelOrderPayload): void {
    const o = this.order();
    if (!o) return;

    this.store.cancelOrder(o.id as string, payload, () => {
      this.cancelOrderDialogVisible.set(false);
      this.store.getById(o.id as string);
    });
  }

  protected onDeliverOrder(payload: DeliverOrderPayload): void {
    const o = this.order();
    if (!o) return;

    this.store.markAsDelivered(o.id as string, payload, () => {
      this.deliverOrderDialogVisible.set(false);
      this.store.getById(o.id as string);
    });
  }

  protected openMarkClaimReceivedDialog(claim: OrderClaim): void {
    this.selectedClaimForAction.set(claim);
    this.markClaimReceivedDialogVisible.set(true);
  }

  protected onMarkClaimReceived(payload: MarkClaimReceivedPayload): void {
    const o = this.order();
    const claim = this.selectedClaimForAction();
    if (!o || !claim) return;

    this.store.markClaimReceived(claim.id, payload, o.id as string, () => {
      this.markClaimReceivedDialogVisible.set(false);
      this.selectedClaimForAction.set(null);
      this.store.getById(o.id as string);
    });
  }

  protected openCompleteRefundDialog(claim: OrderClaim): void {
    this.selectedClaimForAction.set(claim);
    this.selectedRefundForAction.set(null);
    this.completeRefundDialogVisible.set(true);
  }

  protected onCompleteReplacement(claim: OrderClaim): void {
    const o = this.order();
    if (!o) return;

    this.store.completeReplacement(claim.id, o.id as string, () => {
      this.store.getById(o.id as string);
    });
  }

  // ✅ NUEVO - Para cancelaciones (usa el diálogo unificado)
  protected openProcessRefundForCancellation(order: Order): void {
    const pendingRefund = order.refunds?.find((r) => r.status === 'PENDING');
    if (!pendingRefund) return;

    // ✅ Configurar el contexto: ¿fue pago con tarjeta?
    const isCard = order.paymentMethod?.type === 'card';
    const paymentMethodName = order.paymentMethod?.name;

    // Configurar el diálogo antes de abrirlo
    // Necesitamos acceder al componente hijo - usamos una señal
    this.isCardForRefund.set(isCard);
    this.paymentMethodForRefund.set(paymentMethodName ?? null);

    this.selectedClaimForAction.set(null);
    this.selectedRefundForAction.set(pendingRefund);
    this.completeRefundDialogVisible.set(true);
  }

  // ✅ NUEVO - Para reclamos
  protected openCompleteRefundForClaim(claim: OrderClaim): void {
    const order = this.order();
    const isCard = order?.paymentMethod?.type === 'card';
    const paymentMethodName = order?.paymentMethod?.name;

    this.isCardForRefund.set(isCard ?? false);
    this.paymentMethodForRefund.set(paymentMethodName ?? null);

    this.selectedClaimForAction.set(claim);
    this.selectedRefundForAction.set(null);
    this.completeRefundDialogVisible.set(true);
  }

  // ✅ NUEVO - Handler unificado
  protected onCompleteRefund(payload: CompleteRefundPayload): void {
    const claim = this.selectedClaimForAction();
    const refund = this.selectedRefundForAction();
    const o = this.order();
    if (!o) return;

    if (claim) {
      this.store.completeRefund(claim.id, payload, o.id as string, () => {
        this.completeRefundDialogVisible.set(false);
        this.selectedClaimForAction.set(null);
        this.store.getById(o.id as string);
      });
    } else if (refund) {
      this.store.processRefund(refund.id, payload, () => {
        this.completeRefundDialogVisible.set(false);
        this.selectedRefundForAction.set(null);
        this.store.getById(o.id as string);
      });
    }
  }

  protected onDeleteClaim(claim: OrderClaim): void {
    const o = this.order();
    this.dialog.delete({
      title: 'Eliminar reclamación',
      message: '¿Estás seguro de que deseas eliminar permanentemente esta reclamación? Esta acción no se puede deshacer.',
      onAccept: () => {
        this.store.deleteClaim(claim.id, o?.id);
      },
    });
  }

  // ── Navegación ─────────────────────────────────────────────
  protected goBack(): void {
    this.router.navigate(['/ventas/pedidos']);
  }

  protected goToCustomerProfile(customerId: string): void {
    void this.router.navigate(['/ventas/clientes', customerId], {
      queryParams: { from: 'order-detail', orderId: this.id() },
    });
  }
}

// Helper para verificar si hay reembolso pendiente
function hasPendingRefund(order: Order): boolean {
  return order.refunds?.some((r) => r.status === 'PENDING') ?? false;
}
