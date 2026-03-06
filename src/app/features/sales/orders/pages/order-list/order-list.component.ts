import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { orderTableConfig } from '../../config/order-table.config';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { OrderStore } from '../../store/order.store';
import { OrderFilterComponent } from '../../components/order-filter/order-filter.component';
import { Order } from '../../models/order.model';
import { DialogService } from '@shared/services/ui/dialog.service';

@Component({
  selector: 'app-order-list',
  imports: [DataTableComponent, ButtonModule, OrderFilterComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  readonly router = inject(Router);
  readonly store = inject(OrderStore);
  private readonly dialog = inject(DialogService);

  readonly tableConfig = orderTableConfig(this.router, {
    onDelete: (order) => this.onDelete(order),
  });

  readonly drawerVisible = signal(false);

  readonly hasActiveFilters = computed(() => {
    const { status, dateRange } = this.store.filter();
    return !!status || !!dateRange;
  });

  onDelete(order: Order): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar el pedido <strong>${order.code}</strong>?. <br>No se podrá reestablecer la acción`,
      onAccept: () => {
        this.store.delete(order.id);
        this.dialog.success(
          `Pedido ${order.code} eliminado`,
          'Eliminación exitosa',
        );
      },
    });
  }
}
