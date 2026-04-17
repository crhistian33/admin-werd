import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { PaymentMethod } from '../models/payment-method.model';

type PaymentMethodTableCallbacks = {
  onDelete: (method: PaymentMethod) => void;
  onBulkStatusChange: (ids: string[], status: boolean) => void;
};

export const paymentMethodTableConfig = (
  router: Router,
  callback: PaymentMethodTableCallbacks,
): DataTableConfig<PaymentMethod> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: true,
  showCreate: true,
  showDeleteAll: true,
  columns: [
    {
      field: 'code',
      header: 'Código',
      type: 'text',
      sortable: true,
      width: '120px',
    },
    {
      field: 'name',
      header: 'Nombre del Método',
      type: 'text',
      sortable: true,
    },
    {
      field: 'type',
      header: 'Tipo',
      type: 'badge',
      sortable: true,
      width: '180px',
      badges: [
        { value: 'card', label: 'Tarjeta', severity: 'info' },
        { value: 'wallet', label: 'Billetera Digital', severity: 'success' },
        { value: 'cash_code', label: 'Código Pago', severity: 'warn' },
        {
          value: 'cash_on_delivery',
          label: 'Contra Entrega',
          severity: 'secondary',
        },
      ],
      filter: {
        enabled: true,
        type: 'select',
        options: [
          { label: 'Tarjeta', value: 'card' },
          { label: 'Billetera', value: 'wallet' },
          { label: 'Código', value: 'cash_code' },
          { label: 'Contra Entrega', value: 'cash_on_delivery' },
        ],
      },
    },
    {
      field: 'sortOrder',
      header: 'Orden',
      type: 'number',
      sortable: true,
      width: '100px',
    },
    {
      field: 'isActive',
      header: 'Activo',
      type: 'badge',
      sortable: true,
      width: '130px',
      badges: [
        { value: 'true', label: 'Sí', severity: 'success' },
        { value: 'false', label: 'No', severity: 'danger' },
      ],
      filter: {
        enabled: true,
        type: 'boolean',
        options: [
          { label: 'Sí', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    },
    { field: 'actions', header: '', type: 'actions', width: '120px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver método',
      severity: 'info',
      action: (row) =>
        router.navigate(['/configuraciones/metodos-pago', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar método',
      severity: 'warn',
      action: (row) =>
        router.navigate(['/configuraciones/metodos-pago', row.id, 'editar']),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar permanentemente',
      severity: 'danger',
      action: (row) => callback.onDelete(row),
    },
  ],
  bulkActions: [
    {
      label: 'Activar',
      icon: 'pi pi-check-circle',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          true,
        ),
    },
    {
      label: 'Desactivar',
      icon: 'pi pi-ban',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          false,
        ),
    },
  ],
});
