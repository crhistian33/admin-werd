import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { HeroSlidesService } from '../services/hero-slides.service';
import { HeroSlide } from '../models/hero-slide.model';
import {
  HeroSlideFilter,
  heroSlideFilterDefaults,
} from '../models/hero-slide-filter.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class HeroSlideStore extends BaseStore<HeroSlide, HeroSlideFilter> {
  protected readonly service = inject(HeroSlidesService);

  override readonly filter = signal<HeroSlideFilter>(heroSlideFilterDefaults());

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
