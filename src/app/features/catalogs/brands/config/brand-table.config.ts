import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Brand } from '../models/brand.model';

type BrandTableCallbacks = {
  onDelete: (brand: Brand) => void;
};

export const brandTableConfig = (
  router: Router,
  callback: BrandTableCallbacks,
): DataTableConfig<Brand> => ({
  dataKey: 'id',
  globalFilter: true,
  showFilter: false,
  selectable: true,
  columns: [
    {
      field: 'name',
      header: 'Nombre',
      type: 'text',
      sortable: true,
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
      tooltip: 'Ver pedido',
      severity: 'info',
      action: (row) => router.navigate(['/catalogos/marcas', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar',
      severity: 'warn',
      action: (row) => router.navigate(['/catalogos/marcas', row.id, 'editar']),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
      severity: 'danger',
      action: (row) => callback.onDelete(row),
    },
  ],
});
