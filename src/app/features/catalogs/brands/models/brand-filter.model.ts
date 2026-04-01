import { BaseFilter } from '@shared/models/base-filter.model';

export interface BrandFilter extends BaseFilter {
  isActive: boolean | null;
}

export const brandFilterDefaults = (): BrandFilter => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: null,
});
