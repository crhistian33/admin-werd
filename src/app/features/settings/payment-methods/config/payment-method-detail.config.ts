import { DetailViewConfig } from '@shared/types/detail-view.type';

export const PAYMENT_METHOD_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    // ── Fila 1: Info principal + estado ───────────────────────
    {
      layout: 'info',
      title: 'Información general',
      fields: [
        {
          key: 'name',
          label: 'Nombre visible',
          type: 'text',
        },
        {
          key: 'type',
          label: 'Tipo de pago',
          type: 'badge',
          badges: [
            { value: 'card', label: 'Tarjeta (Pasarela)', severity: 'info' },
            {
              value: 'wallet',
              label: 'Billetera Digital',
              severity: 'success',
            },
            { value: 'cash_code', label: 'Código de Pago', severity: 'warn' },
            {
              value: 'cash_on_delivery',
              label: 'Contra entrega',
              severity: 'secondary',
            },
          ],
        },
        {
          key: 'code',
          label: 'Proveedor',
          type: 'badge',
          badges: [
            { value: 'CULQI', label: 'Culqi', severity: 'info' },
            { value: 'NIUBIZ', label: 'Niubiz', severity: 'info' },
            { value: 'IZIPAY', label: 'Izipay', severity: 'info' },
            { value: 'STRIPE', label: 'Stripe', severity: 'info' },
            {
              value: 'YAPE_PLIN_MANUAL',
              label: 'Yape / Plin',
              severity: 'success',
            },
            {
              value: 'MERCADO_PAGO',
              label: 'Mercado Pago',
              severity: 'success',
            },
            { value: 'PAGO_EFECTIVO', label: 'PagoEfectivo', severity: 'warn' },
            { value: 'SAFETY_PAY', label: 'SafetyPay', severity: 'warn' },
            {
              value: 'STORE_PAY',
              label: 'Pago en Tienda',
              severity: 'secondary',
            },
            {
              value: 'COD_DELIVERY',
              label: 'Contra Entrega',
              severity: 'secondary',
            },
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
      layout: 'info',
      title: 'Credenciales técnicas',
      fields: [
        {
          key: 'config.publicKey',
          label: 'Public Key',
          type: 'text',
          visible: (item) => !!item['config']?.publicKey,
          format: (val) => (val ? `${String(val).slice(0, 8)}••••••••` : '—'),
        },
        {
          key: 'config.privateKey',
          label: 'Private Key',
          type: 'text',
          visible: (item) => !!item['config']?.privateKey,
          format: () => '••••••••••••', // nunca mostrar la clave real
        },
        {
          key: 'config.merchantId',
          label: 'Merchant ID',
          type: 'text',
          visible: (item) => !!item['config']?.merchantId,
        },
        {
          key: 'config.expirationHours',
          label: 'Expiración del código',
          type: 'text',
          visible: (item) => !!item['config']?.expirationHours,
          format: (val) => (val ? `${val} hora(s)` : '—'),
        },
        {
          key: 'config.phoneNumber',
          label: 'Número de celular',
          type: 'text',
          visible: (item) => !!item['config']?.phoneNumber,
        },
        {
          key: 'config.ownerName',
          label: 'Titular de la cuenta',
          type: 'text',
          visible: (item) => !!item['config']?.ownerName,
        },
      ],
    },

    // ── Fila 3: Instrucciones ──────────────────────────────────
    {
      layout: 'html',
      title: 'Instrucciones para el cliente',
      span: 2,
      fields: [
        {
          key: 'instructions',
          label: 'Instrucciones',
          type: 'html',
          visible: (item) => !!item['instructions'],
        },
      ],
    },
  ],
};
