import { BaseModel } from '@core/models/base.model';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order extends BaseModel {
  code: string;
  customerName: string;
  total: number;
  status: OrderStatus;
}
