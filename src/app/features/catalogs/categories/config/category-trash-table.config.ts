import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Category } from '../models/category.model';

type TrashTableCallbacks = {
  onRestore: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export const categoryTrashTableConfig = (
  router: Router,
  callbacks: TrashTableCallbacks,
): DataTableConfig<Category> => ({
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
      width: '250px',
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
      field: 'actions',
      header: '',
      type: 'actions',
      width: '100px',
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
