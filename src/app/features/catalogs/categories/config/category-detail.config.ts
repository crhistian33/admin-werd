import { DetailViewConfig } from '@shared/types/detail-view.type';
import { environment } from '@env/environment';

// Layout: [imagen izq] [info der]
export const CATEGORY_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    {
      layout: 'image',
      title: 'Imagen',
      fields: [
        {
          key: '_mainImageUrl',
          label: 'Imagen principal',
          type: 'image',
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
          label: 'Activo',
          type: 'boolean',
          badges: [
            { value: true, label: 'Sí', severity: 'success' },
            { value: false, label: 'No', severity: 'danger' },
          ],
        },
        {
          key: 'parent.name',
          label: 'Categoría padre',
          type: 'text',
          visible: (item) => !!item['parentId'],
        },
        {
          key: '_count.products',
          label: 'Productos asociados',
          type: 'count',
        },
        {
          key: '_count.children',
          label: 'Subcategorías',
          type: 'count',
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
