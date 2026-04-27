import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpContext, httpResource, HttpParams } from '@angular/common/http';
import { BaseStore } from '@core/store/base.store';
import { IS_PUBLIC } from '@core/auth/context/auth.context';
import { OrderService } from '../services/order.service';
import { OrderClaimService } from '../services/order-claim.service';
import { environment } from '@env/environment'; // Importante para la URL base
import {
  orderFilterDefaults,
  type OrderFilter,
} from '../models/order-filter.model';
import type { Order } from '../models/order.model';
import type {
  UpdateOrderStatusPayload,
  CreateRefundPayload,
  UpdateLogisticsPayload,
  CreateClaimPayload,
  ReviewClaimPayload,
  OrderClaim,
  CompleteRefundPayload,
  MarkClaimReceivedPayload,
  DeliverOrderPayload,
  ShipOrderPayload,
  CancelOrderPayload,
  ConfirmPaymentPayload,
} from '../models';
import type { ApiResponse } from '@core/models/api-response.model';
import { OrderRefundService } from '../services/order-refund.service';

@Injectable({ providedIn: 'root' })
export class OrderStore extends BaseStore<Order, OrderFilter> {
  protected readonly service = inject(OrderService);
  private readonly claimService = inject(OrderClaimService);
  private readonly refundService = inject(OrderRefundService);

  override readonly filter = signal<OrderFilter>(orderFilterDefaults());

  readonly isUpdatingStatus = signal(false);
  readonly isProcessingRefund = signal(false);
  readonly isUpdatingLogistics = signal(false);
  readonly isCreatingClaim = signal(false);
  readonly isUpdatingClaimStatus = signal(false);
  readonly isConfirmingPayment = signal(false);
  readonly isCancellingOrder = signal(false);
  readonly isMarkingDelivered = signal(false);
  readonly isDeletingClaim = signal(false);

  /**
   * Conteo de solicitudes de devolución pendientes.
   * Ahora apunta a: /customers/admin/refund-requests
   */
  private readonly _pendingClaimsResource = httpResource<
    ApiResponse<OrderClaim[]>
  >(() => {
    const params = new HttpParams().set('status', 'PENDING');
    return {
      url: `${environment.apiUrl}/orders/claims`,
      context: new HttpContext().set(IS_PUBLIC, false),
      params,
    };
  });

  readonly pendingClaimsCount = computed<number>(
    () => this._pendingClaimsResource.value()?.data?.length ?? 0,
  );

  constructor() {
    super({ useSoftDelete: false });
  }

  // ── Métodos de Recarga ──────────────────────────────────────────────

  /**
   * Refresca tanto la lista de pedidos como el conteo de devoluciones
   */
  override reload(): void {
    super.reload();
    this._pendingClaimsResource.reload();
  }

  // ── Cambio de estado ──────────────────────────────────────────────
  updateStatus(
    id: string,
    payload: UpdateOrderStatusPayload,
    onSuccess?: (order: Order) => void,
  ): void {
    this.isUpdatingStatus.set(true);
    this.service
      .updateStatus(id, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingStatus.set(false);
          this.dialog.success(
            res.message ?? 'Estado del pedido actualizado',
            'Operación exitosa',
          );
          this.reloadActive();
          if (res.data) onSuccess?.(res.data);
        },
        error: () => this.isUpdatingStatus.set(false),
      });
  }

  // ── Devolución ────────────────────────────────────────────────────
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
            res.message ?? 'Devolución procesada correctamente',
            'Devolución registrada',
          );
          this.reloadActive();
          this._pendingClaimsResource.reload(); // Recargamos el conteo al crear devolución
          onSuccess?.();
        },
        error: () => this.isProcessingRefund.set(false),
      });
  }

  readonly countByStatus = computed(() => {
    const data = this.data();
    return data.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  });

  // ── Logistica ──────────────────────────────────────────────────
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
            res.message ?? 'Logística actualizada correctamente',
            'Operación exitosa',
          );
          // Refrescamos el pedido seleccionado (para que recargue los datos)
          if (this.selectedId() === id) {
            this.getById(id);
          }
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isUpdatingLogistics.set(false),
      });
  }

  // ── Reclamaciones ──────────────────────────────────────────────
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
            res.message ?? 'Reclamación creada correctamente',
            'Operación exitosa',
          );
          if (this.selectedId() === orderId) {
            this.getById(orderId);
          }
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
            res.message ?? 'Estado de reclamación actualizado',
            'Operación exitosa',
          );
          if (this.selectedId() === orderId) {
            this.getById(orderId);
          }
          this.reloadActive();
          this._pendingClaimsResource.reload();
          onSuccess?.();
        },
        error: () => this.isUpdatingClaimStatus.set(false),
      });
  }

  deleteClaim(
    claimId: string,
    orderId?: string,
    onSuccess?: () => void,
  ): void {
    this.isDeletingClaim.set(true);
    this.claimService
      .deleteClaim(claimId)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isDeletingClaim.set(false);
          this.dialog.success(
            res.message ?? 'Reclamación eliminada correctamente',
            'Operación exitosa',
          );
          this.reloadActive();
          this._pendingClaimsResource.reload();
          if (orderId && this.selectedId() === orderId) {
            this.getById(orderId);
          }
          onSuccess?.();
        },
        error: () => this.isDeletingClaim.set(false),
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
            res.message || 'Pago confirmado exitosamente',
            'Operación exitosa',
          );
          this.reloadActive();
          if (this.selectedId() === orderId) this.getById(orderId);
          onSuccess?.();
        },
        error: () => this.isConfirmingPayment.set(false),
      });
  }

  markAsProcessing(orderId: string, onSuccess?: () => void): void {
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
          this.reloadActive();
          if (this.selectedId() === orderId) this.getById(orderId);
          onSuccess?.();
        },
        error: () => this.isUpdatingStatus.set(false),
      });
  }

  cancelOrder(
    orderId: string,
    payload: CancelOrderPayload,
    onSuccess?: () => void,
  ): void {
    this.isCancellingOrder.set(true);
    this.service
      .cancelOrder(orderId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isCancellingOrder.set(false);
          this.dialog.success(
            res.message || 'Pedido cancelado exitosamente',
            'Operación exitosa',
          );
          this.reloadActive();
          if (this.selectedId() === orderId) this.getById(orderId);
          onSuccess?.();
        },
        error: () => this.isCancellingOrder.set(false),
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
            res.message || 'Pedido enviado exitosamente',
            'Operación exitosa',
          );
          this.reloadActive();
          if (this.selectedId() === orderId) this.getById(orderId);
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
            res.message || 'Entrega confirmada exitosamente',
            'Operación exitosa',
          );
          this.reloadActive();
          if (this.selectedId() === orderId) this.getById(orderId);
          onSuccess?.();
        },
        error: () => this.isMarkingDelivered.set(false),
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
            res.message || 'Recepción registrada exitosamente',
            'Operación exitosa',
          );
          this._pendingClaimsResource.reload();
          if (this.selectedId() === orderId) this.getById(orderId);
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
    this.isUpdatingClaimStatus.set(true);
    this.claimService
      .completeRefund(claimId, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingClaimStatus.set(false);
          this.dialog.success(
            res.message || 'Reembolso procesado exitosamente',
            'Operación exitosa',
          );
          this._pendingClaimsResource.reload();
          this.reloadActive();
          if (this.selectedId() === orderId) this.getById(orderId);
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
    this.isUpdatingClaimStatus.set(true);
    this.claimService
      .completeReplacement(claimId)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isUpdatingClaimStatus.set(false);
          this.dialog.success(
            res.message || 'Orden de reemplazo generada exitosamente',
            'Operación exitosa',
          );
          this._pendingClaimsResource.reload();
          this.reloadActive();
          if (this.selectedId() === orderId) this.getById(orderId);
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
            res.message || 'Reembolso procesado exitosamente',
            'Operación exitosa',
          );
          this.reloadActive();
          if (this.selectedId()) {
            this.getById(this.selectedId()!);
          }
          onSuccess?.();
        },
        error: () => this.isProcessingRefund.set(false),
      });
  }
}
