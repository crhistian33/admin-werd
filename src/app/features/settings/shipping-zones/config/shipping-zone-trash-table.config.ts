import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { ShippingZone } from '../models/shipping.model';

type TrashTableCallbacks = {
  onRestore: (shippingZone: ShippingZone) => void;
  onDelete: (shippingZone: ShippingZone) => void;
};

export const shippingZoneTrashTableConfig = (
  router: Router,
  callbacks: TrashTableCallbacks,
): DataTableConfig<ShippingZone> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: false, // La papelera no tiene filtros
  isTrashView: true, // Activa el modo papelera en DataTableComponent
  showCreate: false,
  showDeleteAll: true,
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
      width: '200px',
    },
    {
      field: 'sortOrder',
      header: 'Orden',
      type: 'number',
      sortable: true,
      width: '120px',
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
      field: 'deletedBy.name',
      header: 'Eliminado por',
      type: 'text',
      width: '180px',
    },
    { field: 'actions', header: '', type: 'actions', width: '80px' },
  ],
  actions: [
    {
      icon: 'pi pi-refresh',
      tooltip: 'Restaurar',
      severity: 'success',
      action: (row) => callbacks.onRestore(row),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
      severity: 'danger',
      action: (row) => callbacks.onDelete(row),
    },
  ],
});
