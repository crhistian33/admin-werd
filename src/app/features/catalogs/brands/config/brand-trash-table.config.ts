import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Brand } from '../models/brand.model';

type TrashTableCallbacks = {
  onRestore: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
};

export const brandTrashTableConfig = (
  router: Router,
  callbacks: TrashTableCallbacks,
): DataTableConfig<Brand> => ({
  dataKey: 'id',
  globalFilter: true,
  showFilter: false,
  selectable: true,
  isTrashView: true,
  showCreate: false,
  showDeleteAll: true,
  columns: [
    {
      field: 'name',
      header: 'Nombre',
      type: 'text',
      sortable: true,
    },
    {
      field: 'description',
      header: 'Descripción',
      type: 'text',
    },
    {
      field: 'deletedBy.name',
      header: 'Eliminado por',
      type: 'text',
      width: '180px',
    },
    {
      field: 'isActive',
      header: 'Estado',
      type: 'badge',
      width: '150px',
      badges: [
        { value: 'true', label: 'Activo', severity: 'success' },
        { value: 'false', label: 'Inactivo', severity: 'danger' },
      ],
      filter: {
        enabled: true,
        type: 'boolean',
        options: [
          { label: 'Activo', value: true },
          { label: 'Inactivo', value: false },
        ],
      },
    },
    {
      field: 'actions',
      header: '',
      type: 'actions',
      width: '80px',
    },
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
