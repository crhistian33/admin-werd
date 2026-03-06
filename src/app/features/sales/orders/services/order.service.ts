import { Injectable } from '@angular/core';
import type { Order } from '../models/order.model';
import { BaseService } from '@core/services/base.service';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<Order> {
  protected readonly endpoint = 'orders';
}
