import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { Page } from '../models/page.model';
import { PagesService } from '../services/pages.service';
import { PageFilter, pageFilterDefaults } from '../models/page-filter.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class PageStore extends BaseStore<Page> {
  protected readonly service = inject(PagesService);

  override readonly filter = signal<PageFilter>(pageFilterDefaults());

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
