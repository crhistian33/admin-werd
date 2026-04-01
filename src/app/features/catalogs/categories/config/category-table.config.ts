import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Category } from '../models/category.model';

type CategoryTableCallbacks = {
  onDelete: (category: Category) => void;
};

export const categoryTableConfig = (
  router: Router,
  callback: CategoryTableCallbacks,
): DataTableConfig<Category> => ({
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
      width: '250px',
    },
    {
      field: 'description',
      header: 'Descripción',
      type: 'text',
      sortable: true,
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
      icon: 'pi pi-eye',
      tooltip: 'Ver categoría',
      severity: 'info',
      action: (row) => router.navigate(['/catalogos/categorias', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar',
      severity: 'warn',
      action: (row) =>
        router.navigate(['/catalogos/categorias', row.id, 'editar']),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
      severity: 'danger',
      action: (row) => callback.onDelete(row),
      isAsync: true,
    },
  ],
});
