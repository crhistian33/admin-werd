import { ORDERS_MOCK } from './data/orders.mock';
import { CATEGORIES_MOCK } from './data/categories.mock';
import { BRANDS_MOCK } from './data/brands.mock';
import { PRODUCT_MOCK } from './data/products.mock';

export const MOCK_HANDLERS = [
  { url: '/api/v1/orders', method: 'GET', data: ORDERS_MOCK },
  { url: '/api/v1/categories', method: 'GET', data: CATEGORIES_MOCK },
  { url: '/api/v1/categories', method: 'POST', data: CATEGORIES_MOCK },
  { url: '/api/v1/categories', method: 'PATCH', data: CATEGORIES_MOCK },
  { url: '/api/v1/categories', method: 'DELETE', data: CATEGORIES_MOCK },
  { url: '/api/v1/brands', method: 'GET', data: BRANDS_MOCK },
  { url: '/api/v1/brands', method: 'POST', data: BRANDS_MOCK },
  { url: '/api/v1/brands', method: 'PATCH', data: BRANDS_MOCK },
  { url: '/api/v1/brands', method: 'DELETE', data: BRANDS_MOCK },
  { url: '/api/v1/products', method: 'GET', data: PRODUCT_MOCK },
];
