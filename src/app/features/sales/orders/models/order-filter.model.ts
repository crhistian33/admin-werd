import type { BaseFilter } from '@shared/models/base-filter.model';
import type { OrderStatus } from './order.model';

export interface OrderFilter extends BaseFilter {
  status: OrderStatus | null;
  dateRange: [Date, Date | null] | null;
}

export const orderFilterDefaults = (): OrderFilter => ({
  page: 1,
  limit: 10,
  search: '',
  status: null,
  dateRange: null,
});
