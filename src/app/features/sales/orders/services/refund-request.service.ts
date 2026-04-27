import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base.service';
import { ApiResponse } from '@core/models/api-response.model';
import type { RefundRequest } from '../models/refund-request.model';
import type { ReviewRefundRequestPayload } from '../models/refund-request.model';

@Injectable({ providedIn: 'root' })
export class RefundRequestService extends BaseService<RefundRequest> {
  protected readonly endpoint = 'customers/admin/refund-requests';

  review(
    requestId: string,
    payload: ReviewRefundRequestPayload,
  ): Observable<ApiResponse<unknown>> {
    return this.http.patch<ApiResponse<unknown>>(
      `${this.url}/${requestId}/review`,
      payload,
      { context: this.context },
    );
  }
}
