import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Role } from '../models/role.model';

export const roleTableConfig = (router: Router): DataTableConfig<Role> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: false,
  showFilter: true,
  showCreate: false,
  showDeleteAll: false,
  columns: [
    {
      field: 'name',
      header: 'Nombre',
      type: 'text',
      sortable: true,
      width: '250px',
      format: (value: string) => {
        const roleLabels: Record<string, string> = {
          admin: 'Administrador',
          viewer: 'Lector',
          editor: 'Editor',
          super_admin: 'Super Administrador',
        };
        return roleLabels[value] || value;
      },
    },
    {
      field: 'description',
      header: 'Descripción',
      type: 'text',
      sortable: true,
    },
  ],
});
