import type { DataTableConfig } from '@shared/types/data-table.type';
import type { OrderClaim } from '../models/order-claim.model';
import {
  CLAIM_TYPE_LABELS,
  CLAIM_STATUS_LABELS,
  REASON_CATEGORY_LABELS,
  CLAIM_STATUS_SEVERITY,
} from '../models/order-claim.model';

type OrderClaimTableCallbacks = {
  onViewOrder: (claim: OrderClaim) => void;
  onReview: (claim: OrderClaim) => void; // Para PENDING → Aprobar/Rechazar
  onRegisterShipment: (claim: OrderClaim) => void; // Para APPROVED sin envío
  onMarkReceived: (claim: OrderClaim) => void; // Para APPROVED con envío confirmado
  onProcessRefund: (claim: OrderClaim) => void; // Para RECEIVED + REFUND
  onProcessReplacement: (claim: OrderClaim) => void; // Para RECEIVED + REPLACEMENT
  isActionLoading?: () => boolean;
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
      width: '160px',
    },
    {
      field: 'order.orderNumber',
      header: 'Pedido',
      type: 'text',
      sortable: false,
      width: '160px',
    },
    {
      field: 'type',
      header: 'Tipo',
      type: 'badge',
      width: '200px',
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
      format: (val: string) =>
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
      header: 'Fecha de reclamo',
      type: 'datetime',
      sortable: true,
      width: '140px',
    },
    { field: 'actions', header: '', type: 'actions', width: '100px' },
  ],
  actions: [
    // ✅ Botón 1: Ver Pedido (SIEMPRE visible)
    {
      icon: 'pi pi-external-link',
      tooltip: 'Ver Pedido',
      severity: 'info',
      action: (row) => callbacks.onViewOrder(row),
    },
    // ✅ Botón 2: Revisar (Aprobar/Rechazar) - SOLO PENDING
    {
      icon: 'pi pi-check-circle',
      tooltip: 'Revisar reclamo',
      severity: 'warn',
      action: (row) => callbacks.onReview(row),
      visible: (claim) => claim.status === 'PENDING',
      disabled: () => callbacks.isActionLoading?.() ?? false,
    },
    // ✅ Botón 3: Registrar envío de devolución - SOLO APPROVED SIN envío
    {
      icon: 'pi pi-truck',
      tooltip: 'Registrar envío de devolución',
      severity: 'info',
      action: (row) => callbacks.onRegisterShipment(row),
      visible: (claim) =>
        claim.status === 'APPROVED' &&
        !claim.returnShipmentConfirmedAt &&
        (claim.type === 'REFUND' || claim.type === 'REPLACEMENT'),
      disabled: () => callbacks.isActionLoading?.() ?? false,
    },
    // ✅ Botón 4: Registrar recepción - SOLO APPROVED CON envío confirmado
    {
      icon: 'pi pi-box',
      tooltip: 'Registrar recepción del producto',
      severity: 'success',
      action: (row) => callbacks.onMarkReceived(row),
      visible: (claim) =>
        claim.status === 'APPROVED' &&
        !!claim.returnShipmentConfirmedAt &&
        (claim.type === 'REFUND' || claim.type === 'REPLACEMENT'),
      disabled: () => callbacks.isActionLoading?.() ?? false,
    },
    // ✅ Botón 5: Procesar reembolso - SOLO RECEIVED + REFUND
    {
      icon: 'pi pi-money-bill',
      tooltip: 'Procesar reembolso',
      severity: 'info',
      action: (row) => callbacks.onProcessRefund(row),
      visible: (claim) =>
        (claim.status === 'RECEIVED' && claim.type === 'REFUND') ||
        (claim.status === 'APPROVED' &&
          claim.type === 'CANCELLATION' &&
          !!claim.refundMethod),
      disabled: () => callbacks.isActionLoading?.() ?? false,
    },
    // ✅ Botón 6: Generar reemplazo - SOLO RECEIVED + REPLACEMENT
    {
      icon: 'pi pi-refresh',
      tooltip: 'Generar orden de reemplazo',
      severity: 'info',
      action: (row) => callbacks.onProcessReplacement(row),
      visible: (claim) =>
        claim.status === 'RECEIVED' && claim.type === 'REPLACEMENT',
      disabled: () => callbacks.isActionLoading?.() ?? false,
    },
  ],
});
