import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Product } from '../models/product.model';

type ProductTrashTableCallbacks = {
  onRestore: (product: Product) => void;
  onDelete: (product: Product) => void;
  onStatusChange?: (product: Product) => void;
};

export const productTrashTableConfig = (
  router: Router,
  callbacks: ProductTrashTableCallbacks,
): DataTableConfig<Product> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: false, // La papelera no tiene filtros
  isTrashView: true,
  showCreate: false,
  showDeleteAll: true,
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
      field: 'price.price',
      header: 'Precio',
      type: 'currency',
      sortable: true,
      width: '120px',
    },
    {
      field: 'category.name',
      header: 'Categoría',
      type: 'text',
      sortable: true,
      width: '120px',
    },
    {
      field: 'brand.name',
      header: 'Marca',
      type: 'text',
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
        { value: 'draft', label: 'Borrador', severity: 'warn' },
        { value: 'active', label: 'Publicado', severity: 'success' },
        { value: 'inactive', label: 'Archivado', severity: 'danger' },
        { value: 'out_of_stock', label: 'Agotado', severity: 'warn' },
      ],
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
