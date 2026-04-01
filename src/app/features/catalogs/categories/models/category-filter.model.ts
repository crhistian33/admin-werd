import { BaseFilter } from '@shared/models/base-filter.model';

export interface CategoryFilter extends BaseFilter {
  isActive: boolean | null;
}

export const categoryFilterDefaults = (): CategoryFilter => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: null,
});
