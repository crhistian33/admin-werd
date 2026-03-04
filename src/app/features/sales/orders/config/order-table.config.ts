import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Order } from '../models/order.model';

export const orderTableConfig = (router: Router): DataTableConfig<Order> => ({
  dataKey: 'id',
  globalFilter: true,
  columns: [
    {
      field: 'code',
      header: '# Pedido',
      type: 'text',
      sortable: true,
      width: '120px',
    },
    { field: 'customerName', header: 'Cliente', type: 'text', sortable: true },
    {
      field: 'total',
      header: 'Total',
      type: 'currency',
      sortable: true,
      width: '120px',
    },
    {
      field: 'createdAt',
      header: 'Fecha',
      type: 'date',
      sortable: true,
      width: '120px',
    },
    {
      field: 'status',
      header: 'Estado',
      type: 'badge',
      sortable: true,
      width: '130px',
      badges: [
        { value: 'pending', label: 'Pendiente', severity: 'warn' },
        { value: 'processing', label: 'En proceso', severity: 'info' },
        { value: 'shipped', label: 'Enviado', severity: 'secondary' },
        { value: 'delivered', label: 'Entregado', severity: 'success' },
        { value: 'cancelled', label: 'Cancelado', severity: 'danger' },
      ],
    },
    { field: 'actions', header: '', type: 'actions', width: '80px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver pedido',
      severity: 'info',
      action: (row) => router.navigate(['/ventas/pedidos', row.id]),
    },
  ],
});
