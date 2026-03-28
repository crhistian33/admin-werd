import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { ProductService } from '../services/product.service';
import {
  productFilterDefaults,
  type ProductFilter,
} from '../models/product-filter.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductStore extends BaseStore<Product, ProductFilter> {
  protected readonly service = inject(ProductService);

  override readonly filter = signal<ProductFilter>(productFilterDefaults());

  // Si necesitas búsqueda local adicional, implementa aquí, pero la tabla ahora usa items() directamente.
}
