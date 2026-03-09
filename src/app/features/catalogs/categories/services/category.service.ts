import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService<Category> {
  protected readonly endpoint = 'categories';
}
