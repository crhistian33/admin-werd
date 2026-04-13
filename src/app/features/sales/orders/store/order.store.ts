import { computed, inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { OrderService } from '../services/order.service';
import {
  orderFilterDefaults,
  type OrderFilter,
} from '../models/order-filter.model';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderStore extends BaseStore<Order, OrderFilter> {
  protected readonly service = inject(OrderService);

  override readonly filter = signal<OrderFilter>(orderFilterDefaults());

  constructor() {
    super({ useSoftDelete: false });
  }
}
