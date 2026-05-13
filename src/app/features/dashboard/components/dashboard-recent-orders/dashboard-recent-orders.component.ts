import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  OrderStatus,
  RecentOrder,
} from '@features/dashboard/models/dashboard-response.model';
import { TagSeverity } from '@shared/types/severity.type';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

const ORDER_SEVERITY: Record<OrderStatus, TagSeverity> = {
  pending_payment: 'warn',
  paid: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'secondary',
};

const ORDER_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Pdte. Pago',
  paid: 'Pagado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

@Component({
  selector: 'app-dashboard-recent-orders',
  imports: [TableModule, TagModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard-recent-orders.component.html',
  styleUrl: './dashboard-recent-orders.component.scss',
})
export class DashboardRecentOrdersComponent {
  readonly orders = input<RecentOrder[]>([]);

  severity(status: OrderStatus): TagSeverity {
    return ORDER_SEVERITY[status] ?? 'secondary';
  }
  label(status: OrderStatus): string {
    return ORDER_LABEL[status] ?? status;
  }
}
