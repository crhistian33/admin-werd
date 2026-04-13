import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Product, ProductStatus } from '../models/product.model';
import { Category } from '@features/catalogs/categories/models/category.model';
import { Brand } from '@features/catalogs/brands/models/brand.model';
import { environment } from '@env/environment';

type ProductTableCallbacks = {
  onDelete: (product: Product) => void;
  onBulkStatusChange: (ids: string[], status: ProductStatus) => void;
};

export const productTableConfig = (
  router: Router,
  callback: ProductTableCallbacks,
  options: {
    categories: Category[];
    brands: Brand[];
  },
): DataTableConfig<Product> => ({
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
      filterField: 'categoryId',
      header: 'Categoría',
      type: 'text',
      sortable: true,
      width: '120px',
      filter: {
        enabled: true,
        type: 'select',
        options: options.categories.map((c) => ({
          label: c.name,
          value: c.id,
        })),
      },
    },
    {
      field: 'brand.name',
      filterField: 'brandId',
      header: 'Marca',
      type: 'text',
      sortable: true,
      width: '120px',
      filter: {
        enabled: true,
        type: 'select',
        options: options.brands.map((b) => ({ label: b.name, value: b.id })),
      },
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
        { value: 'draft', label: 'Borrador', severity: 'warn' },
        { value: 'active', label: 'Publicado', severity: 'success' },
        { value: 'inactive', label: 'Archivado', severity: 'danger' },
        { value: 'out_of_stock', label: 'Agotado', severity: 'warn' },
      ],
      filter: {
        enabled: true,
        type: 'boolean',
        options: [
          { label: 'Borrador', value: 'draft' },
          { label: 'Publicado', value: 'active' },
          { label: 'Archivado', value: 'inactive' },
          { label: 'Agotado', value: 'out_of_stock' },
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
  bulkActions: [
    {
      label: 'Activar',
      icon: 'pi pi-check-circle',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          'active',
        ),
    },
    {
      label: 'Desactivar',
      icon: 'pi pi-ban',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          'inactive',
        ),
    },
    {
      label: 'Borrador',
      icon: 'pi pi-file-edit',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          'draft',
        ),
    },
  ],
});
