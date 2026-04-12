import { DetailViewConfig } from '@shared/types/detail-view.type';
import { environment } from '@env/environment';

export const HERO_SLIDE_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    // ── Fila 1: galería + info principal ──────────────────────
    {
      layout: 'image',
      title: 'Imagen',
      fields: [
        {
          key: '_mainDesktopImageUrl',
          label: 'Imagen principal (Desktop)',
          type: 'image',
          imageBaseUrl: environment.apiImagesUrl,
        },
        {
          key: '_mainMobileImageUrl',
          label: 'Imagen principal (Mobile)',
          type: 'image',
          imageBaseUrl: environment.apiImagesUrl,
        },
      ],
    },
    {
      layout: 'info',
      title: 'Información principal',
      fields: [
        {
          key: 'title',
          label: 'Título',
          type: 'text',
          format: (val) => val ?? '—',
        },
        {
          key: 'subtitle',
          label: 'Subtítulo',
          type: 'text',
          format: (val) => val ?? '—',
        },
        {
          key: 'linkType',
          label: 'Tipo de enlace',
          type: 'badge',
          badges: [
            { value: 'product', label: 'Producto', severity: 'success' },
            { value: 'category', label: 'Categoría', severity: 'info' },
            { value: 'external', label: 'Externo', severity: 'warn' },
            { value: 'none', label: 'Ninguno', severity: 'danger' },
          ],
        },
        {
          key: 'link',
          label: 'Enlace',
          type: 'text',
          visible: (item) => !!item['link'],
        },
        {
          key: 'sortOrder',
          label: 'Orden',
          type: 'number',
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
          key: 'updatedAt',
          label: 'Última actualización',
          type: 'date',
          dateFormat: 'dd/MM/yyyy HH:mm',
        },
      ],
    },
  ],
};
