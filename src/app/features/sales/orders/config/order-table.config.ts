import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Order, getCustomerName } from '../models/order.model';

type OrderTableCallbacks = {
  onStatusChange: (order: Order) => void;
  getActionTooltip: (order: Order) => string;
};

export const orderTableConfig = (
  router: Router,
  callback: OrderTableCallbacks,
): DataTableConfig<Order> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: false,
  showFilter: true,
  showCreate: false, // Los pedidos no se crean desde el CMS admin
  showDeleteAll: false, // No se eliminan pedidos
  columns: [
    {
      field: 'orderNumber',
      header: '# Pedido',
      type: 'text',
      sortable: true,
      width: '180px',
    },
    {
      field: 'customer.firstName',
      header: 'Cliente',
      type: 'text',
      sortable: false,
      format: (_val, row: Order) => getCustomerName(row),
    },
    {
      field: 'paymentMethod.name',
      header: 'Método pago',
      type: 'text',
      sortable: false,
      width: '200px',
      format: (_val, row: Order) => row.paymentMethod?.name ?? '—',
    },
    {
      field: 'total',
      header: 'Total',
      type: 'currency',
      sortable: true,
      width: '150px',
    },
    {
      field: 'placedAt',
      header: 'Fecha pedido',
      type: 'date',
      sortable: true,
      width: '150px',
    },
    {
      field: 'status',
      header: 'Estado',
      type: 'badge',
      sortable: true,
      width: '170px',
      filter: {
        enabled: true,
        type: 'select',
        options: [
          { label: 'Pendiente de pago', value: 'pending_payment' },
          { label: 'Pagado', value: 'paid' },
          { label: 'En proceso', value: 'processing' },
          { label: 'Enviado', value: 'shipped' },
          { label: 'Entregado', value: 'delivered' },
          { label: 'Cancelado', value: 'cancelled' },
          { label: 'Reembolsado', value: 'refunded' },
        ],
      },
      badges: [
        { value: 'pending_payment', label: 'Pendiente pago', severity: 'warn' },
        { value: 'paid', label: 'Pagado', severity: 'success' },
        { value: 'processing', label: 'En proceso', severity: 'info' },
        { value: 'shipped', label: 'Enviado', severity: 'secondary' },
        { value: 'delivered', label: 'Entregado', severity: 'success' },
        { value: 'cancelled', label: 'Cancelado', severity: 'danger' },
        { value: 'refunded', label: 'Reembolsado', severity: 'contrast' },
      ],
    },
    { field: 'actions', header: '', type: 'actions', width: '100px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver detalle',
      severity: 'info',
      action: (row) => router.navigate(['/ventas/pedidos', row.id]),
    },
    {
      icon: 'pi pi-sync',
      tooltip: (row) => callback.getActionTooltip(row),
      severity: 'warn',
      // ✅ Solo disponible en estados NO terminales
      disabled: (row) =>
        row.status === 'cancelled' ||
        row.status === 'refunded' ||
        row.status === 'delivered' ||
        row.status === 'shipped', // ← AGREGADO: shipped no tiene acción en lista
      action: (row) => callback.onStatusChange(row),
    },
  ],
});
