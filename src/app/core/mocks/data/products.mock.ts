import { Product } from '@features/catalogs/products/models/product.model';

export const PRODUCT_MOCK: Product[] = [
  {
    id: 1,
    sku: 'SKU65654',
    name: 'Laptop ASUS 16" 32 GB',
    price: 100,
    slug: 'laptop-asus-16',
    description: 'Producto de alta calidad',
    stock: 20,
    categoryId: 1,
    brandId: 1,
    status: 'success',
  },
];
