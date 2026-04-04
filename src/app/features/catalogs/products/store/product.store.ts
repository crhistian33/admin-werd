import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { ProductService } from '../services/product.service';
import {
  productFilterDefaults,
  type ProductFilter,
} from '../models/product-filter.model';
import { Product } from '../models/product.model';
import { DialogService } from '@shared/services/ui/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ProductStore extends BaseStore<Product, ProductFilter> {
  protected readonly service = inject(ProductService);

  override readonly filter = signal<ProductFilter>(productFilterDefaults());

  // Si necesitas búsqueda local adicional, implementa aquí, pero la tabla ahora usa items() directamente.
  changeStatus(ids: string[], status: string, onSuccess?: () => void) {
    this.isSaving.set(true);
    this.service
      .changeStatus(ids, status)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.dialog.success(
            res.message || 'Actualización de estados realizados',
            'Operación exitosa',
          );
          this.reloadActive();
          onSuccess?.();
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }
}
