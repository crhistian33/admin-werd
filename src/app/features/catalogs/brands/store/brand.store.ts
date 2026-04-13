import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { BrandService } from '../services/brand.service';
import { Brand } from '../models/brand.model';
import { BrandFilter, brandFilterDefaults } from '../models/brand-filter.model';

@Injectable({ providedIn: 'root' })
export class BrandStore extends BaseStore<Brand> {
  protected readonly service = inject(BrandService);
  override readonly filter = signal<BrandFilter>(brandFilterDefaults());

  constructor() {
    super({ useSoftDelete: true });
  }

  // Si necesitas búsqueda local adicional, implementa aquí, pero la tabla ahora usa items() directamente.
}
