// src/app/features/sales/orders/config/order-claim.config.ts
import type { DataTableConfig } from '@shared/types/data-table.type';
import type { OrderClaim } from '../models/order-claim.model';
import {
  CLAIM_TYPE_LABELS,
  CLAIM_STATUS_LABELS,
  REASON_CATEGORY_LABELS,
  CLAIM_STATUS_SEVERITY,
} from '../models/order-claim.model';
import { DatePipe } from '@angular/common';

type OrderClaimTableCallbacks = {
  onViewOrder: (claim: OrderClaim) => void;
  onUpdateStatus: (claim: OrderClaim) => void;
  onDeleteClaim: (claim: OrderClaim) => void;
};

export const claimTableConfig = (
  callbacks: OrderClaimTableCallbacks,
): DataTableConfig<OrderClaim> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: false,
  showFilter: true,
  showCreate: false,
  showDeleteAll: false,
  columns: [
    {
      field: 'claimNumber',
      header: '# Reclamo',
      type: 'text',
      sortable: true,
      width: '140px',
    },
    {
      field: 'order.orderNumber',
      header: 'Pedido',
      type: 'text',
      sortable: false,
      width: '140px',
      format: (_, row) => row.order?.orderNumber?.slice(-8) || '—',
    },
    {
      field: 'type',
      header: 'Tipo',
      type: 'badge',
      width: '150px',
      badgeConfig: {
        valueMap: CLAIM_TYPE_LABELS,
        severityMap: {
          CANCELLATION: 'danger',
          REFUND: 'warn',
          REPLACEMENT: 'info',
        },
      },
    },
    {
      field: 'reasonCategory',
      header: 'Motivo',
      type: 'text',
      width: '160px',
      format: (val: any) =>
        REASON_CATEGORY_LABELS[val as keyof typeof REASON_CATEGORY_LABELS],
    },
    {
      field: 'status',
      header: 'Estado',
      type: 'badge',
      width: '130px',
      filter: {
        enabled: true,
        type: 'select',
        options: Object.entries(CLAIM_STATUS_LABELS).map(([value, label]) => ({
          label,
          value,
        })),
      },
      badgeConfig: {
        valueMap: CLAIM_STATUS_LABELS,
        severityMap: CLAIM_STATUS_SEVERITY,
      },
    },
    {
      field: 'createdAt',
      header: 'Fecha',
      type: 'date',
      sortable: true,
      width: '130px',
    },
    { field: 'actions', header: '', type: 'actions', width: '130px' },
  ],
  actions: [
    {
      icon: 'pi pi-external-link',
      tooltip: 'Ver Pedido',
      severity: 'info',
      action: (row) => callbacks.onViewOrder(row),
    },
    {
      icon: 'pi pi-sync',
      tooltip: 'Gestionar Estado',
      severity: 'warn',
      action: (row) => callbacks.onUpdateStatus(row),
      disabled: (claim) =>
        claim.status === 'COMPLETED' ||
        claim.status === 'REJECTED' ||
        claim.status === 'CANCELLED',
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar Reclamación',
      severity: 'danger',
      action: (row) => callbacks.onDeleteClaim(row),
      disabled: (claim) =>
        claim.status !== 'REJECTED' && claim.status !== 'CANCELLED',
    },
  ],
});
