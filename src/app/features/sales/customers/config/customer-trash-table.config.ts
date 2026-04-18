import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Customer } from '../models/customer.model';

type TrashTableCallbacks = {
  onRestore: (customer: Customer) => void;
};

export const customerTrashTableConfig = (
  router: Router,
  callbacks: TrashTableCallbacks,
): DataTableConfig<Customer> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: false,
  isTrashView: true,
  showCreate: false,
  showDeleteAll: false,
  columns: [
    {
      field: 'firstName',
      header: 'Nombre',
      type: 'text',
      sortable: true,
      format: (val, row: Customer) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: 'email',
      header: 'Email',
      type: 'text',
      sortable: true,
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
  ],
});
