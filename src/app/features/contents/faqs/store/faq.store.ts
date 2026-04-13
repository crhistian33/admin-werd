import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { FaqFilter, faqFilterDefaults } from '../models/faq-filter.model';
import { Faq } from '../models/faq.model';
import { FaqsService } from '../services/faqs.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FaqStore extends BaseStore<Faq, FaqFilter> {
  protected readonly service = inject(FaqsService);

  override readonly filter = signal<FaqFilter>(faqFilterDefaults());

  constructor() {
    super({ useSoftDelete: false });
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
}
