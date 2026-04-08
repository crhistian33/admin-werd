import { DetailViewConfig } from '@shared/types/detail-view.type';
import { environment } from '@env/environment';

// Layout: [imagen izq] [info der]
export const BRAND_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    {
      layout: 'image',
      title: 'Logo',
      fields: [
        {
          key: '_mainImageUrl',
          label: 'Imagen principal',
          type: 'logo',
          imageBaseUrl: environment.apiImagesUrl,
        },
      ],
    },
    {
      layout: 'info',
      title: 'Información general',
      fields: [
        {
          key: 'description',
          label: 'Descripción',
          type: 'text',
        },
        {
          key: 'isActive',
          label: 'Estado',
          type: 'boolean',
          badges: [
            { value: true, label: 'Activo', severity: 'success' },
            { value: false, label: 'Inactivo', severity: 'danger' },
          ],
        },
        // {
        //   key: '_count.products',
        //   label: 'Productos asociados',
        //   type: 'count',
        // },
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
