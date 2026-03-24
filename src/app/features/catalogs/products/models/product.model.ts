export type ProductStatus = 'success' | 'warning';

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  categoryId: number;
  brandId: number;
  status: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
