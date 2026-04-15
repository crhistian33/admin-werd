import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { Faq } from '../models/faq.model';

type FaqTableCallbacks = {
  onDelete: (faq: Faq) => void;
  onBulkStatusChange: (ids: string[], status: boolean) => void;
};

export const faqTableConfig = (
  router: Router,
  callback: FaqTableCallbacks,
): DataTableConfig<Faq> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: true,
  columns: [
    {
      field: 'question',
      header: 'Pregunta',
      type: 'text',
      sortable: true,
      width: '250px',
    },
    {
      field: 'answer',
      header: 'Respuesta',
      type: 'text',
      sortable: true,
    },
    {
      field: 'category',
      header: 'Categoría',
      type: 'badge',
      sortable: true,
      width: '150px',
      badges: [
        { value: 'general', label: 'General', severity: 'success' },
        { value: 'shipping', label: 'Envío', severity: 'info' },
        { value: 'payment', label: 'Pago', severity: 'warn' },
        { value: 'none', label: 'Ninguno', severity: 'danger' },
      ],
      filter: {
        enabled: true,
        type: 'select',
        options: [
          { label: 'General', value: 'general' },
          { label: 'Envío', value: 'shipping' },
          { label: 'Pago', value: 'payment' },
          { label: 'Ninguno', value: 'none' },
        ],
      },
    },
    {
      field: 'sortOrder',
      header: 'Orden',
      type: 'number',
      sortable: true,
      width: '100px',
    },
    {
      field: 'isActive',
      header: 'Activo',
      type: 'badge',
      sortable: true,
      width: '100px',
      badges: [
        { value: 'true', label: 'Si', severity: 'success' },
        { value: 'false', label: 'No', severity: 'danger' },
      ],
      filter: {
        enabled: true,
        type: 'boolean',
        options: [
          { label: 'Si', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    },
    {
      field: 'createdBy.name',
      header: 'Creado por',
      type: 'text',
      width: '150px',
    },
    { field: 'actions', header: '', type: 'actions', width: '80px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver pregunta',
      severity: 'info',
      action: (row) =>
        router.navigate(['/contenidos/preguntas-frecuentes', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar',
      severity: 'warn',
      action: (row) =>
        router.navigate(['/contenidos/preguntas-frecuentes', row.id, 'editar']),
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
          true,
        ),
    },
    {
      label: 'Desactivar',
      icon: 'pi pi-ban',
      action: (rows) =>
        callback.onBulkStatusChange(
          rows.map((r) => r.id),
          false,
        ),
    },
  ],
});
