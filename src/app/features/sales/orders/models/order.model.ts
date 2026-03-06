export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: number;
  code: string;
  customerName: string;
  total: number;
  createdAt: string;
  status: OrderStatus;
}
