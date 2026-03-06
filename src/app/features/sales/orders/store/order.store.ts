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

  readonly filter = signal<OrderFilter>(orderFilterDefaults());

  readonly filteredItems = computed(() => {
    let items = this.items();
    const { status, dateRange } = this.filter();

    if (status) {
      items = items.filter((o) => o.status === status);
    }

    if (dateRange) {
      const [from, to] = dateRange;

      items = items.filter((o) => {
        const [year, month, day] = o.createdAt.split('-').map(Number);
        const date = new Date(year, month - 1, day, 0, 0, 0, 0);

        if (from && to) {
          const fromStart = new Date(from);
          fromStart.setHours(0, 0, 0, 0);
          const toEnd = new Date(to);
          toEnd.setHours(23, 59, 59, 999);
          return date >= fromStart && date <= toEnd;
        }

        if (from && !to) {
          const fromStart = new Date(from);
          fromStart.setHours(0, 0, 0, 0);
          return date >= fromStart;
        }

        return true;
      });
    }

    return this.applySearch(items, ['code', 'customerName']);
  });
}
