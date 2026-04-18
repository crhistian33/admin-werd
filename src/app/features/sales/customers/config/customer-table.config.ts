import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Customer } from '../models/customer.model';

export const customerTableConfig = (
  router: Router,
  actions: {
    onDelete: (customer: Customer) => void;
    onBulkStatusChange: (ids: string[], status: boolean) => void;
  },
): DataTableConfig<Customer> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: true,
  showCreate: false, // Por ahora no se crean clientes desde el admin según requerimiento previo
  showDeleteAll: true,
  columns: [
    {
      field: 'firstName',
      header: 'Nombre',
      type: 'text',
      sortable: true,
    },
    {
      field: 'lastName',
      header: 'Apellido',
      type: 'text',
      sortable: true,
    },
    {
      field: 'email',
      header: 'Email',
      type: 'text',
      sortable: true,
    },
    {
      field: 'phone',
      header: 'Teléfono',
      type: 'text',
    },
    {
      field: 'isActive',
      header: 'Activo',
      type: 'badge',
      sortable: true,
      badges: [
        { value: 'true', label: 'Si', severity: 'success' },
        { value: 'false', label: 'No', severity: 'danger' },
      ],
    },
    {
      field: 'actions',
      header: 'Acciones',
      type: 'actions',
    },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver cliente',
      severity: 'info',
      action: (customer) => router.navigate(['/ventas/clientes', customer.id]),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
      severity: 'danger',
      action: (customer) => actions.onDelete(customer),
    },
  ],
  bulkActions: [
    {
      label: 'Activar',
      icon: 'pi pi-check-circle',
      severity: 'success',
      action: (rows) =>
        actions.onBulkStatusChange(
          rows.map((r) => r.id),
          true,
        ),
    },
    {
      label: 'Desactivar',
      icon: 'pi pi-ban',
      severity: 'warn',
      action: (rows) =>
        actions.onBulkStatusChange(
          rows.map((r) => r.id),
          false,
        ),
    },
  ],
});
