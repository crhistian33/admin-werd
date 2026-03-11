import { ORDERS_MOCK } from './data/orders.mock';
import { CATEGORIES_MOCK } from './data/categories.mock';
import { BRANDS_MOCK } from './data/brands.mock';

export const MOCK_HANDLERS = [
  { url: '/api/orders', method: 'GET', data: ORDERS_MOCK },
  { url: '/api/categories', method: 'GET', data: CATEGORIES_MOCK },
  { url: '/api/categories', method: 'POST', data: CATEGORIES_MOCK },
  { url: '/api/categories', method: 'PATCH', data: CATEGORIES_MOCK },
  { url: '/api/categories', method: 'DELETE', data: CATEGORIES_MOCK },
  { url: '/api/brands', method: 'GET', data: BRANDS_MOCK },
  { url: '/api/brands', method: 'POST', data: BRANDS_MOCK },
  { url: '/api/brands', method: 'PATCH', data: BRANDS_MOCK },
  { url: '/api/brands', method: 'DELETE', data: BRANDS_MOCK },
];
