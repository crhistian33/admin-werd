import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { PaymentMethod } from '../models/payment-method.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService extends BaseService<PaymentMethod> {
  protected readonly endpoint = 'payment-methods';

  reorder(ids: string[]): Observable<ApiResponse<PaymentMethod[]>> {
    return this.http.patch<ApiResponse<PaymentMethod[]>>(
      `${this.url}/bulk/reorder`,
      { ids },
      { context: this.context },
    );
  }
}
