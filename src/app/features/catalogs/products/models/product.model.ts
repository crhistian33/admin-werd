import { BaseModel } from '@core/models/base.model';

export type ProductStatus = 'success' | 'warning';

export interface Product extends BaseModel {
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  categoryId: string;
  brandId: string;
  status: ProductStatus;
}
