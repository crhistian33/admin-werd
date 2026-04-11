import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Page, PageStatus } from '../models/page.model';

type PageTableCallbacks = {
  onDelete: (page: Page) => void;
  onBulkStatusChange: (ids: string[], status: PageStatus) => void;
};

export const pageTableConfig = (
  router: Router,
  callback: PageTableCallbacks,
): DataTableConfig<Page> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: true,
  columns: [
    {
      field: 'title',
      header: 'Título',
      type: 'text',
      sortable: true,
    },
    {
      field: 'status',
      header: 'Estado',
      type: 'badge',
      sortable: true,
      width: '130px',
      badges: [
        { value: 'draft', label: 'Borrador', severity: 'warn' },
        { value: 'published', label: 'Publicado', severity: 'success' },
      ],
      filter: {
        enabled: true,
        type: 'boolean',
        options: [
          { label: 'Borrador', value: 'draft' },
          { label: 'Publicado', value: 'published' },
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
      tooltip: 'Ver página',
      severity: 'info',
      action: (row) =>
        router.navigate(['/contenidos/paginas-internas', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar',
      severity: 'warn',
      action: (row) =>
        router.navigate(['/contenidos/paginas-internas', row.id, 'editar'], {
          queryParams: { returnUrl: router.url },
        }),
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
      label: 'Publicar',
      icon: 'pi pi-check-circle',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          'published',
        ),
    },
    {
      label: 'Cambiar a borrador',
      icon: 'pi pi-file-edit',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          'draft',
        ),
    },
  ],
});
