import { DetailViewConfig } from '@shared/types/detail-view.type';

export const PAGE_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    {
      layout: 'html',
      title: 'Contenido',
      span: 1,
      fields: [
        {
          key: 'content',
          label: 'Contenido',
          type: 'html',
        },
      ],
    },
    {
      layout: 'info',
      title: 'Información general',
      fields: [
        {
          key: 'status',
          label: 'Estado',
          type: 'badge',
          badges: [
            { value: 'draft', label: 'Borrador', severity: 'warn' },
            { value: 'published', label: 'Publicado', severity: 'success' },
          ],
        },
        {
          key: 'updatedAt',
          label: 'Última actualización',
          type: 'date',
          dateFormat: 'dd/MM/yyyy HH:mm',
        },
        {
          key: 'createdAt',
          label: 'Creado el',
          type: 'date',
          dateFormat: 'dd/MM/yyyy',
        },
      ],
    },
  ],
};
