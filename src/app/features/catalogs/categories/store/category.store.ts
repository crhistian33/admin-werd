import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import {
  CategoryFilter,
  categoryFilterDefaults,
} from '../models/category-filter.model';

@Injectable({ providedIn: 'root' })
export class CategoryStore extends BaseStore<Category> {
  protected readonly service = inject(CategoryService);

  override readonly filter = signal<CategoryFilter>(categoryFilterDefaults());
}
