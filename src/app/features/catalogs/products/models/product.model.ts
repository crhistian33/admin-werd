import { BaseModel } from '@core/models/base.model';
import { Brand } from '@features/catalogs/brands/models/brand.model';
import { Category } from '@features/catalogs/categories/models/category.model';
import { ImageRecord } from '@shared/images/interfaces/image.interface';
import { ProductPrice } from './product-price.model';

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'out_of_stock';

export interface Product extends BaseModel {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  brandId: string;
  status: ProductStatus;
  isFeatured: boolean;
  stock: number;
  weight?: number;
  metaTitle?: string;
  metaDescription?: string;
  deletedAt?: string | null;
  category?: Category;
  brand?: Brand;
  price: ProductPrice;
  images?: ImageRecord[];
}
