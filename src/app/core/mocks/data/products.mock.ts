import { Product } from '@features/catalogs/products/models/product.model';

export const PRODUCT_MOCK: Product[] = [
  {
    id: '1',
    sku: 'SKU65654',
    name: 'Laptop ASUS 16" 32 GB',
    price: {
      id: '1',
      productId: '1',
      price: 1500,
      currency: 'USD',
      cost: 1200,
      updatedAt: '2026-03-26 00:04:35.120',
    },
    slug: 'laptop-asus-16',
    shortDescription: 'Laptop ASUS de alta gama con pantalla de 16 pulgadas',
    description: 'Producto de alta calidad',
    isFeatured: false,
    stock: 20,
    categoryId: '1',
    brandId: '1',
    status: 'active',
    features: [],
    specs: [],
  },
];
