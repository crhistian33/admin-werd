import { DetailViewConfig } from '@shared/types/detail-view.type';

export const FAQ_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    {
      layout: 'info',
      title: 'Información',
      fields: [
        {
          key: 'question',
          label: 'Pregunta',
          type: 'text',
          format: (val) => val ?? '—',
        },
        {
          key: 'answer',
          label: 'Respuesta',
          type: 'text',
          format: (val) => val ?? '—',
        },
        {
          key: 'category',
          label: 'Categoría',
          type: 'badge',
          badges: [
            { value: 'general', label: 'General', severity: 'success' },
            { value: 'shipping', label: 'Envío', severity: 'info' },
            { value: 'payment', label: 'Pago', severity: 'warn' },
            { value: 'none', label: 'Ninguno', severity: 'danger' },
          ],
        },
        {
          key: 'isActive',
          label: 'Activo',
          type: 'boolean',
          badges: [
            { value: true, label: 'Sí', severity: 'success' },
            { value: false, label: 'No', severity: 'danger' },
          ],
        },
        {
          key: 'sortOrder',
          label: 'Orden',
          type: 'number',
          format: (val) => val ?? '—',
        },
        {
          key: 'updatedAt',
          label: 'Última actualización',
          type: 'date',
          dateFormat: 'dd/MM/yyyy HH:mm',
        },
      ],
    },
  ],
};
