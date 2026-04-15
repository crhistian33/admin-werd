import { DetailViewConfig } from '@shared/types/detail-view.type';

export const SHIPPING_ZONE_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    {
      layout: 'info',
      title: 'Información general',
      fields: [
        {
          key: 'name',
          label: 'Nombre de la zona',
          type: 'text',
        },
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
          key: 'updatedAt',
          label: 'Última actualización',
          type: 'date',
          dateFormat: 'dd/MM/yyyy HH:mm',
        },
      ],
    },

    // ── Fila 2: Credenciales técnicas ─────────────────────────
    {
      layout: 'shipping-data',
      title: 'Datos de envío',
      fields: [
        {
          key: 'rates',
          label: 'Tarifas',
          type: 'rates',
          visible: (item) => !!item['rates']?.length,
        },
        {
          key: 'areas',
          label: 'Áreas',
          type: 'areas',
          visible: (item) => !!item['areas']?.length,
        },
      ],
    },
  ],
};
