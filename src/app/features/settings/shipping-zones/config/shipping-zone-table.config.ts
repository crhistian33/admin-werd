import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { ShippingZone } from '../models/shipping.model';

type ShippingZoneTableCallbacks = {
  onDelete: (shippingZone: ShippingZone) => void;
  onBulkStatusChange: (ids: string[], status: boolean) => void;
};

export const shippingZoneTableConfig = (
  router: Router,
  callback: ShippingZoneTableCallbacks,
): DataTableConfig<ShippingZone> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: true,
  columns: [
    {
      field: 'name',
      header: 'Nombre',
      type: 'text',
      sortable: true,
      width: '200px',
    },
    {
      field: 'description',
      header: 'Descripción',
      type: 'text',
      sortable: true,
    },
    {
      field: 'isActive',
      header: 'Activo',
      type: 'badge',
      sortable: true,
      width: '120px',
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
    {
      field: 'createdBy.name',
      header: 'Creado por',
      type: 'text',
      width: '180px',
    },
    { field: 'actions', header: '', type: 'actions', width: '80px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver zona de envío',
      severity: 'info',
      action: (row) =>
        router.navigate(['/configuraciones/zonas-envio', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar',
      severity: 'warn',
      action: (row) =>
        router.navigate(['/configuraciones/zonas-envio', row.id, 'editar']),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
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
