import { computed, inject, Injectable } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { BrandService } from '../services/brand.service';
import { Brand } from '../models/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandStore extends BaseStore<Brand> {
  protected readonly service = inject(BrandService);

  // Si necesitas búsqueda local adicional, implementa aquí, pero la tabla ahora usa items() directamente.
}
