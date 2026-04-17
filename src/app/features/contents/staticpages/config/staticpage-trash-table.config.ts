import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Page } from '../models/page.model';

type TrashTableCallbacks = {
  onRestore: (page: Page) => void;
  onDelete: (page: Page) => void;
};

export const pageTrashTableConfig = (
  router: Router,
  callbacks: TrashTableCallbacks,
): DataTableConfig<Page> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: false, // La papelera no tiene filtros
  isTrashView: true, // Activa el modo papelera en DataTableComponent
  showCreate: false,
  showDeleteAll: true,
  columns: [
    {
      field: 'title',
      header: 'Título',
      type: 'text',
      sortable: true,
      width: '250px',
    },
    {
      field: 'deletedAt',
      header: 'Eliminado el',
      type: 'date',
      sortable: true,
      width: '160px',
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
