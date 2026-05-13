import { DataTableConfig } from '@shared/types/data-table.type';
import { Order, getCustomerName } from '../models/order.model';

import * as U from '../utils/order-calculations.utils';
import { ORDER_STATUS_LABELS } from '../models/order.model';

type OrderTableCallbacks = {
  onViewOrder: (order: Order) => void;
  onAction: (actionType: string, order: Order) => void;
};

export const orderTableConfig = (
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
      width: '200px',
      children: [
        {
          field: 'parentOrderId',
          header: '',
          type: 'badge',
          width: '100px',
          badges: [{ value: 'true', label: 'Reemplazo', severity: 'info' }],
          format: (_val, row: Order) => (row.parentOrderId ? 'true' : ''),
        },
      ],
    },
    {
      field: 'customer.firstName',
      header: 'Cliente',
      type: 'text',
      sortable: false,
      width: '200px',
      format: (_val, row: Order) => getCustomerName(row),
    },
    {
      field: 'items',
      header: '# Prod.',
      type: 'html',
      sortable: false,
      width: '100px',
      format: (_val, row: Order) => {
        if (!row.items || row.items.length === 0) return '—';
        const originalQty = U.getTotalOriginalQuantity(row);
        const effectiveQty = U.getTotalEffectiveQuantity(row);

        if (effectiveQty !== originalQty) {
          return `
            <div class="flex items-center gap-2 leading-tight">
              <span class="text-slate-400 line-through text-[10px]">${originalQty}</span>
              <span class="text-primary font-semibold">${effectiveQty}</span>
            </div>
          `;
        }
        return `<span class="font-semibold text-slate-700">${originalQty}</span>`;
      },
    },
    {
      field: 'paymentMethod.name',
      header: 'Método pago',
      type: 'text',
      sortable: false,
      width: '160px',
      format: (_val, row: Order) => row.paymentMethod?.name ?? '—',
    },
    {
      field: 'total',
      header: 'Total',
      type: 'currency',
      sortable: true,
      width: '150px',
    },
    // ✅ Total Reembolsado
    {
      field: '_refunded',
      header: 'Total reembolso',
      type: 'html',
      sortable: false,
      width: '130px',
      format: (_val, row: Order) => {
        const refunded = U.getTotalAlreadyRefunded(row);
        if (refunded === 0) return '<span class="text-slate-300">—</span>';
        return `<span class="text-red-500 font-semibold">-${U.formatCurrency(refunded)}</span>`;
      },
    },
    // ✅ Neto Ingreso (Total - Reembolsado)
    {
      field: '_netIncome',
      header: 'Neto Ingreso',
      type: 'html',
      sortable: false,
      width: '130px',
      format: (_val, row: Order) => {
        const total = Number(row.total);
        const refunded = U.getTotalAlreadyRefunded(row);
        const neto = total - refunded;
        if (row.status === 'cancelled' || row.paidAt === null)
          return '<span class="text-slate-300">—</span>';
        if (refunded === 0)
          return `<span class="text-slate-700 font-semibold">${U.formatCurrency(total)}</span>`;
        if (neto >= 0) {
          return `<span class="text-green-600 font-semibold">${U.formatCurrency(neto)}</span>`;
        }
        return `<span class="text-red-500 font-semibold">${U.formatCurrency(neto)}</span>`;
      },
    },
    {
      field: 'placedAt',
      header: 'Fecha pedido',
      type: 'datetime',
      sortable: true,
      width: '160px',
    },
    {
      field: 'status',
      header: 'Estado',
      type: 'badge',
      sortable: true,
      width: '160px',
      filter: {
        enabled: true,
        type: 'select',
        options: Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
          label,
          value,
        })),
      },
      badgeConfig: {
        valueMap: ORDER_STATUS_LABELS,
        severityMap: {
          pending_payment: 'warn',
          paid: 'success',
          processing: 'info',
          shipped: 'secondary',
          delivered: 'success',
          cancelled: 'danger',
          refunded: 'secondary',
        },
      },
    },
    { field: 'actions', header: '', type: 'actions', width: '100px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver detalle',
      severity: 'info',
      action: (row) => callback.onViewOrder(row),
    },
    {
      icon: 'pi pi-check-circle',
      tooltip: 'Confirmar pago',
      severity: 'success',
      visible: (row) =>
        U.isManualPayment(row) && row.status === 'pending_payment',
      action: (row) => callback.onAction('confirm-payment', row),
    },
    {
      icon: 'pi pi-box',
      tooltip: 'Preparar pedido',
      severity: 'warn',
      visible: (row) =>
        (U.isCashOnDelivery(row) && row.status === 'pending_payment') ||
        row.status === 'paid',
      action: (row) => callback.onAction('mark-processing', row),
    },
    {
      icon: 'pi pi-truck',
      tooltip: 'Enviar pedido',
      severity: 'info',
      visible: (row) => row.status === 'processing',
      action: (row) => callback.onAction('ship-order', row),
    },
    {
      icon: 'pi pi-check',
      tooltip: 'Confirmar entrega',
      severity: 'success',
      visible: (row) => row.status === 'shipped',
      action: (row) => callback.onAction('deliver-order', row),
    },
    {
      icon: 'pi pi-times',
      tooltip: 'Cancelar pedido',
      severity: 'danger',
      visible: (row) =>
        !['shipped', 'delivered', 'cancelled', 'refunded'].includes(row.status),
      action: (row) => callback.onAction('cancel-order', row),
    },
    {
      icon: 'pi pi-exclamation-circle',
      tooltip: 'Generar reclamo',
      severity: 'secondary',
      visible: (row) => row.status === 'delivered',
      action: (row) => callback.onAction('create-claim', row),
    },
  ],
});
