import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { Order } from '../../models/order.model';
import { orderTableConfig } from '../../config/order-table.config';
import { OrderService } from '../../services/order.service';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { DataTableConfig } from '@shared/types/data-table.type';

@Component({
  selector: 'app-order-list',
  imports: [DataTableComponent, ButtonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(false);
  selectedOrders: Order[] = [];

  // Config instanciada con el router inyectado
  readonly tableConfig: DataTableConfig<Order> = orderTableConfig(this.router);

  ngOnInit(): void {
    this.loading.set(true);
    this.orderService.getAll().subscribe({
      next: (data) => this.orders.set(data),
      complete: () => this.loading.set(false),
    });
  }
}
