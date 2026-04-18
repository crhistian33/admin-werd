import { DetailViewConfig } from '@shared/types/detail-view.type';

export const CUSTOMER_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    {
      layout: 'info',
      title: 'Información Personal',
      fields: [
        { key: 'firstName', label: 'Nombre', type: 'text' },
        { key: 'lastName', label: 'Apellido', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phone', label: 'Teléfono', type: 'text' },
        { key: 'createdAt', label: 'Fecha Registro', type: 'date' },
        { key: 'lastLoginAt', label: 'Último Inicio de Sesión', type: 'date' },
      ],
    },
    {
      layout: 'info',
      title: 'Cuenta',
      fields: [
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
          key: 'emailVerifiedAt',
          label: 'Email Verificado',
          type: 'date',
          format: (val) => val ?? 'No',
        },
        {
          key: 'googleId',
          label: 'ID Google',
          type: 'text',
          visible: (c) => !!c['googleId'],
        },
      ],
    },
    {
      title: 'Direcciones',
      layout: 'addresses',
      fields: [{ key: 'addresses', label: 'Direcciones', type: 'addresses' }],
      span: 2,
    },
  ],
};
