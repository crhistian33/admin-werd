import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Product } from '../models/product.model';

type ProductTableCallbacks = {
  onDelete: (product: Product) => void;
  onStatusChange?: (product: Product) => void;
};

export const productTableConfig = (
  router: Router,
  callback: ProductTableCallbacks,
): DataTableConfig<Product> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  columns: [
    {
      field: 'sku',
      header: 'SKU',
      type: 'text',
      sortable: true,
      width: '120px',
    },
    { field: 'name', header: 'Nombre', type: 'text', sortable: true },
    {
      field: 'price',
      header: 'Precio',
      type: 'currency',
      sortable: true,
      width: '120px',
    },
    {
      field: 'stock',
      header: 'Stock',
      type: 'number',
      sortable: true,
      width: '120px',
    },
    {
      field: 'status',
      header: 'Estado',
      type: 'badge',
      sortable: true,
      width: '130px',
      badges: [
        { value: 'success', label: 'Con stock', severity: 'success' },
        { value: 'warning', label: 'Sin stock', severity: 'warn' },
      ],
    },
    { field: 'actions', header: '', type: 'actions', width: '80px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver producto',
      severity: 'info',
      action: (row) => router.navigate(['/catalogos/productos', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar',
      severity: 'warn',
      action: (row) =>
        router.navigate(['/catalogos/productos', row.id, 'editar']),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
      severity: 'danger',
      action: (row) => callback.onDelete(row),
    },
  ],
});
