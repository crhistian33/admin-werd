import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Category } from '../models/category.model';
import { environment } from '@env/environment';

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
      field: 'images',
      header: 'Imagen',
      type: 'image',
      width: '100px',
      format: (val, row: any) => {
        const thumb = row.images?.[0]?.variants?.thumb;
        if (!thumb) return null;
        return thumb.startsWith('http')
          ? thumb
          : `${environment.apiImagesUrl}${thumb}`;
      },
    },
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
      field: 'createdBy.name',
      header: 'Creado por',
      type: 'text',
      width: '180px',
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
    },
  ],
});
