import { computed, inject, Injectable } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryStore extends BaseStore<Category> {
  protected readonly service = inject(CategoryService);

  readonly filteredItems = computed(() => {
    return this.applySearch(this.items(), ['name', 'description']);
  });
}
