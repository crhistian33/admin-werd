import { BaseFilter } from '@shared/models/base-filter.model';

export interface ShippingZoneFilter extends BaseFilter {
  isActive: boolean | null;
}

export const shippingZoneFilterDefaults = (): ShippingZoneFilter => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: null,
});
