import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaymentMethod } from '../models/payment-method.model';
import { PaymentMethodsService } from '../services/payment-methods.service';
import {
  PaymentMethodFilter,
  paymentMethodFilterDefaults,
} from '../models/payment-method-filter.model';

@Injectable({ providedIn: 'root' })
export class PaymentMethodStore extends BaseStore<
  PaymentMethod,
  PaymentMethodFilter
> {
  protected readonly service = inject(PaymentMethodsService);

  override readonly filter = signal<PaymentMethodFilter>(
    paymentMethodFilterDefaults(),
  );

  constructor() {
    super({ useSoftDelete: true });
  }

  reorder(ids: string[], onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .reorder(ids)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialog.success('Orden actualizado', 'Operación exitosa');
          this.reloadActive();
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  changeStatus(ids: string[], status: boolean, onSuccess?: () => void) {
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
