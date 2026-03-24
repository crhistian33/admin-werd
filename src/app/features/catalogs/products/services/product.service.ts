import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import type { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<Product> {
  protected readonly endpoint = 'products';
}
