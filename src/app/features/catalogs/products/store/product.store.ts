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

  readonly filteredItems = computed(() => {
    let items = this.items();
    const { status } = this.filter();

    if (status) {
      items = items.filter((o) => o.status === status);
    }

    return this.applySearch(items, ['sku', 'name']);
  });
}
