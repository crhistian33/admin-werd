import type { BaseFilter } from '@shared/models/base-filter.model';
import type { ProductStatus } from './product.model';

export interface ProductFilter extends BaseFilter {
  status: ProductStatus | null;
  categoryId: string | null;
  brandId: string | null;
}

export const productFilterDefaults = (): ProductFilter => ({
  page: 1,
  limit: 10,
  search: '',
  status: null,
  categoryId: null,
  brandId: null,
});
