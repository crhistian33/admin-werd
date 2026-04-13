import { BaseFilter } from '@shared/models/base-filter.model';

export interface FaqFilter extends BaseFilter {
  isActive: boolean | null;
}

export const faqFilterDefaults = (): FaqFilter => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: null,
});
