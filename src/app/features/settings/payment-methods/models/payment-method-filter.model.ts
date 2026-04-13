import { BaseFilter } from '@shared/models/base-filter.model';
import { PaymentMethodType } from './payment-method.model';

export interface PaymentMethodFilter extends BaseFilter {
  isActive: boolean | null;
  type: PaymentMethodType | null;
}

export const paymentMethodFilterDefaults = (): PaymentMethodFilter => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: null,
  type: null,
});
