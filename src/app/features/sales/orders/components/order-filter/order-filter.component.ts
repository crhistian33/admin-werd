import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';

import { FilterDrawerComponent } from '@shared/components/ui/filter-drawer/filter-drawer.component';
import { OrderStore } from '../../store/order.store';
import { OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-filter',
  imports: [
    FilterDrawerComponent,
    DatePickerModule,
    SelectModule,
    FormsModule,
    FloatLabelModule,
  ],
  templateUrl: './order-filter.component.html',
  styleUrl: './order-filter.component.scss',
})
export class OrderFilterComponent {
  readonly store = inject(OrderStore);
  readonly visible = model<boolean>(false);

  selectedStatus: OrderStatus | null = null;
  selectedDateRange: Date[] | null = null;

  readonly statusOptions: { label: string; value: OrderStatus }[] = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'En proceso', value: 'processing' },
    { label: 'Enviado', value: 'shipped' },
    { label: 'Entregado', value: 'delivered' },
    { label: 'Cancelado', value: 'cancelled' },
  ];

  readonly clearFilters = (): void => {
    this.selectedStatus = null;
    this.selectedDateRange = null;
    this.store.setFilter({ status: null, dateRange: null });
  };

  onDateRange(range: Date[] | null): void {
    if (!range || !range[0]) {
      this.store.setFilter({ dateRange: null });
      return;
    }
    this.store.setFilter({ dateRange: [range[0], range[1] ?? null] as any });
  }
}
