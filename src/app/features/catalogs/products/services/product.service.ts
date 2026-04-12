import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import type { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<Product> {
  protected readonly endpoint = 'products';

  changeStatus(
    ids: string[],
    status: string,
  ): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(
      `${this.url}/bulk-status`,
      { ids, status },
      { context: this.context },
    );
  }
}
