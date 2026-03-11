import { computed, inject, Injectable } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { BrandService } from '../services/brand.service';
import { Brand } from '../models/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandStore extends BaseStore<Brand> {
  protected readonly service = inject(BrandService);

  readonly filteredItems = computed(() => {
    return this.applySearch(this.items(), ['name']);
  });
}
