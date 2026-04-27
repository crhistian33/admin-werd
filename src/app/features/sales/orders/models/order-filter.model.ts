import type { BaseFilter } from '@shared/models/base-filter.model';
import { OrderStatus } from './orders.enum';

export interface OrderFilter extends BaseFilter {
  status: OrderStatus | null;
  customerId: string | null;
  paymentMethodId: string | null;
}

export const orderFilterDefaults = (): OrderFilter => ({
  page: 1,
  limit: 10,
  search: '',
  status: null,
  customerId: null,
  paymentMethodId: null,
});
