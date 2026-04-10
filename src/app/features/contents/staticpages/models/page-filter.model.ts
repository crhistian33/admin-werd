import { BaseFilter } from '@shared/models/base-filter.model';
import type { PageStatus } from './page.model';

export interface PageFilter extends BaseFilter {
  status: PageStatus | null;
}

export const pageFilterDefaults = (): PageFilter => ({
  page: 1,
  limit: 10,
  search: '',
  status: null,
});
