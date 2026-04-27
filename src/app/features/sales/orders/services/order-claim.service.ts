import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base.service';
import { ApiResponse } from '@core/models/api-response.model';
import type {
  CompleteRefundPayload,
  MarkClaimReceivedPayload,
  OrderClaim,
} from '../models';
import type { CreateClaimPayload, ReviewClaimPayload } from '../models/';

@Injectable({ providedIn: 'root' })
export class OrderClaimService extends BaseService<OrderClaim> {
  protected readonly endpoint = 'orders/claims'; // Endpoint base global para listado de claims

  // ── Operaciones anidadas al pedido ──────────────────────────

  getByOrder(orderId: string): Observable<ApiResponse<OrderClaim[]>> {
    return this.http.get<ApiResponse<OrderClaim[]>>(
      `${this.url}/orders/${orderId}/claims`,
      { context: this.context },
    );
  }

  createClaim(
    orderId: string,
    payload: CreateClaimPayload,
  ): Observable<ApiResponse<OrderClaim>> {
    return this.http.post<ApiResponse<OrderClaim>>(
      `${this.url}/orders/${orderId}/claims`,
      payload,
      { context: this.context },
    );
  }

  // ── Operaciones directas sobre la reclamación ───────────────

  reviewClaim(
    claimId: string,
    payload: ReviewClaimPayload,
  ): Observable<ApiResponse<OrderClaim>> {
    return this.http.patch<ApiResponse<OrderClaim>>(
      `${this.url}/${claimId}/review`,
      payload,
      { context: this.context },
    );
  }

  /**
   * Confirmar recepción del producto devuelto
   * Endpoint: PATCH /orders/claims/:claimId/received
   */
  markClaimReceived(
    claimId: string,
    payload: MarkClaimReceivedPayload,
  ): Observable<ApiResponse<{ success: boolean; claimId: string }>> {
    return this.http.patch<ApiResponse<{ success: boolean; claimId: string }>>(
      `${this.url}/${claimId}/received`,
      payload,
      { context: this.context },
    );
  }

  /**
   * Completar reembolso
   * Endpoint: PATCH /orders/claims/:claimId/complete-refund
   */
  completeRefund(
    claimId: string,
    payload: CompleteRefundPayload,
  ): Observable<
    ApiResponse<{ success: boolean; claimId: string; refundId: string }>
  > {
    return this.http.patch<
      ApiResponse<{ success: boolean; claimId: string; refundId: string }>
    >(`${this.url}/${claimId}/complete-refund`, payload, {
      context: this.context,
    });
  }

  /**
   * Completar reemplazo (generar orden de reemplazo)
   * Endpoint: PATCH /orders/claims/:claimId/complete-replacement
   */
  completeReplacement(claimId: string): Observable<
    ApiResponse<{
      success: boolean;
      claimId: string;
      replacementOrderId: string;
    }>
  > {
    return this.http.patch<
      ApiResponse<{
        success: boolean;
        claimId: string;
        replacementOrderId: string;
      }>
    >(
      `${this.url}/${claimId}/complete-replacement`,
      {},
      { context: this.context },
    );
  }

  /**
   * Eliminar definitivamente una reclamación (solo válidos estados finales como CANCELLED o REJECTED)
   * Endpoint: DELETE /orders/claims/:claimId
   */
  deleteClaim(claimId: string): Observable<ApiResponse<{ success: boolean; claimId: string }>> {
    return this.http.delete<ApiResponse<{ success: boolean; claimId: string }>>(
      `${this.url}/${claimId}`,
      { context: this.context },
    );
  }
}
