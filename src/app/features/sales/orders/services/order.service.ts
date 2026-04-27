import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base.service';
import { ApiResponse } from '@core/models/api-response.model';
import type { Order } from '../models/order.model';
import type {
  UpdateOrderStatusPayload,
  CreateRefundPayload,
  UpdateLogisticsPayload,
  OrderLogistics,
  ConfirmPaymentPayload,
  CancelOrderPayload,
  ShipOrderPayload,
  DeliverOrderPayload,
} from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<Order> {
  // El CMS apunta al endpoint de admin
  protected readonly endpoint = 'orders';

  // ── Por número de pedido ──────────────────────────────────
  getByNumber(orderNumber: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(
      `${this.url}/number/${orderNumber}`,
      { context: this.context },
    );
  }

  // ── Cambio de estado ──────────────────────────────────────
  updateStatus(
    id: string,
    payload: UpdateOrderStatusPayload,
  ): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      `${this.url}/${id}/status`,
      payload,
      { context: this.context },
    );
  }

  // ── Devolución ────────────────────────────────────────────
  createRefund(
    id: string,
    payload: CreateRefundPayload,
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.url}/${id}/refunds`,
      payload,
      { context: this.context },
    );
  }

  // ── Logística ─────────────────────────────────────────────
  getLogistics(id: string): Observable<ApiResponse<OrderLogistics>> {
    return this.http.get<ApiResponse<OrderLogistics>>(
      `${this.url}/${id}/logistics`,
      { context: this.context },
    );
  }

  updateLogistics(
    id: string,
    payload: UpdateLogisticsPayload,
  ): Observable<ApiResponse<OrderLogistics>> {
    return this.http.patch<ApiResponse<OrderLogistics>>(
      `${this.url}/${id}/logistics/shipped`,
      payload,
      { context: this.context },
    );
  }

  /**
   * Confirmar pago manual (YAPE/PLIN/Transferencia)
   * Endpoint: PATCH /orders/:id/confirm-payment
   */
  confirmPayment(
    id: string,
    payload: ConfirmPaymentPayload,
  ): Observable<
    ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
  > {
    return this.http.patch<
      ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
    >(`${this.url}/${id}/confirm-payment`, payload, { context: this.context });
  }

  /**
   * Marcar pedido como en preparación (paid → processing)
   * Endpoint: PATCH /orders/:id/mark-processing
   */
  markAsProcessing(
    id: string,
  ): Observable<
    ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
  > {
    return this.http.patch<
      ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
    >(`${this.url}/${id}/mark-processing`, {}, { context: this.context });
  }

  /**
   * Cancelar pedido (admin)
   * Endpoint: PATCH /orders/:id/cancel
   */
  cancelOrder(
    id: string,
    payload: CancelOrderPayload,
  ): Observable<
    ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
  > {
    return this.http.patch<
      ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
    >(`${this.url}/${id}/cancel`, payload, { context: this.context });
  }

  /**
   * Enviar pedido (processing → shipped)
   * Endpoint: PATCH /orders/:id/logistics/shipped
   * NOTA: Ya existe updateLogistics, pero creamos un alias semántico
   */
  shipOrder(
    id: string,
    payload: ShipOrderPayload,
  ): Observable<ApiResponse<OrderLogistics>> {
    // Transformar al formato que espera el backend
    const backendPayload: UpdateLogisticsPayload = {
      deliveryType: payload.deliveryType,
      courierName: payload.courierName,
      trackingNumber: payload.trackingNumber,
      actualShippingCost: payload.actualShippingCost,
      internalTransportCost: payload.internalTransportCost,
      tempImageIds: payload.tempImageIds,
    };
    return this.updateLogistics(id, backendPayload);
  }

  /**
   * Confirmar entrega (shipped → delivered)
   * Endpoint: PATCH /orders/:id/logistics/delivered
   */
  markAsDelivered(
    id: string,
    payload: DeliverOrderPayload,
  ): Observable<
    ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
  > {
    return this.http.patch<
      ApiResponse<{ success: boolean; orderId: string; newStatus: string }>
    >(`${this.url}/${id}/logistics/delivered`, payload, {
      context: this.context,
    });
  }
}
