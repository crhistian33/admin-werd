import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base.service';
import { ApiResponse } from '@core/models/api-response.model';
import { CompleteRefundPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderRefundService extends BaseService<any> {
  protected readonly endpoint = 'orders/refunds'; // ← Verificar ruta en backend

  /**
   * Procesar un reembolso pendiente
   * Endpoint: PATCH /orders/refunds/:refundId/process
   */
  processRefund(
    refundId: string,
    payload: CompleteRefundPayload,
  ): Observable<ApiResponse<{ success: boolean; refundId: string }>> {
    return this.http.patch<ApiResponse<{ success: boolean; refundId: string }>>(
      `${this.url}/${refundId}/process`,
      payload,
      { context: this.context },
    );
  }
}
