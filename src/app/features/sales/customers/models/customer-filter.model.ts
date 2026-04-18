import { BaseFilter } from '@shared/models/base-filter.model';

export interface CustomerFilter extends BaseFilter {
  isActive: boolean | null;
}

export const customerFilterDefaults = (): CustomerFilter => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: null,
});
