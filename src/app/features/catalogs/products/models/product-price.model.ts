export interface ProductPrice {
  id: string;
  productId: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  currency?: string;
  updatedAt: string;
}
