import type { BaseFilter } from '@shared/models/base-filter.model';
import type { ProductStatus } from './product.model';

export interface ProductFilter extends BaseFilter {
  status: ProductStatus | null;
}

export const productFilterDefaults = (): ProductFilter => ({
  search: '',
  status: null,
});
