import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';

const PAYMENT_OPTIONS = {
  card: [
    { label: 'Culqi', value: 'CULQI' },
    { label: 'Niubiz', value: 'NIUBIZ' },
    { label: 'Izipay', value: 'IZIPAY' },
    { label: 'Stripe', value: 'STRIPE' },
  ],
  wallet: [
    { label: 'Yape / Plin Directo', value: 'YAPE_PLIN_MANUAL' },
    { label: 'Mercado Pago (Wallet)', value: 'MERCADO_PAGO' },
  ],
  cash_code: [
    { label: 'PagoEfectivo', value: 'PAGO_EFECTIVO' },
    { label: 'SafetyPay', value: 'SAFETY_PAY' },
  ],
  cash_on_delivery: [
    { label: 'Pago en Tienda', value: 'STORE_PAY' },
    { label: 'Contra Entrega Delivery', value: 'COD_DELIVERY' },
  ],
};

// Campos de config por proveedor
export const CONFIG_FIELDS_BY_CODE: Record<string, string[]> = {
  CULQI: ['publicKey', 'privateKey'],
  STRIPE: ['publicKey', 'privateKey'],
  NIUBIZ: ['publicKey', 'privateKey', 'merchantId'],
  IZIPAY: ['publicKey', 'privateKey', 'merchantId'],
  PAGO_EFECTIVO: ['publicKey', 'privateKey', 'merchantId', 'expirationHours'],
  SAFETY_PAY: ['publicKey', 'privateKey'],
  YAPE_PLIN_MANUAL: ['phoneNumber', 'ownerName'],
  MERCADO_PAGO: ['publicKey', 'privateKey'],
  STORE_PAY: [],
  COD_DELIVERY: [],
};

export function buildPaymentMethodFormConfig(): FormStepConfig[] {
  return [
    {
      title: 'Configuración básica',
      fields: [
        {
          key: 'name',
          label: 'Nombre visible para el cliente',
          type: 'text',
          placeholder: 'Ej: Paga con Tarjeta',
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'type',
          label: 'Tipo de pago',
          type: 'select',
          options: [
            { label: 'Tarjeta (Pasarela)', value: 'card' },
            { label: 'Billetera Digital', value: 'wallet' },
            { label: 'Código de Pago (Efectivo)', value: 'cash_code' },
            { label: 'Pago contra entrega', value: 'cash_on_delivery' },
          ],
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'code',
          label: 'Proveedor / Pasarela',
          type: 'select',
          options: (v) =>
            PAYMENT_OPTIONS[v['type'] as keyof typeof PAYMENT_OPTIONS] ?? [],
          visibleWhen: (v) => !!v['type'],
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'sortOrder',
          label: 'Orden de aparición',
          type: 'number',
          placeholder: '0',
          validators: [Validators.required, Validators.min(0)],
          cols: 1,
        },
        {
          key: 'isActive',
          label: 'Activo',
          type: 'switch',
          cols: 1,
          showOnCreate: false,
        },
      ],
    },
    {
      title: 'Credenciales técnicas',
      fields: [
        // ── Pasarelas de tarjeta y billetera digital ──────────────
        {
          key: 'publicKey',
          label: 'Public Key / Client ID',
          type: 'text',
          placeholder: 'Ej: pk_test_...',
          hint: 'Clave pública proporcionada por el proveedor',
          visibleWhen: (v) =>
            [
              'CULQI',
              'NIUBIZ',
              'IZIPAY',
              'STRIPE',
              'PAGO_EFECTIVO',
              'SAFETY_PAY',
              'MERCADO_PAGO',
            ].includes(v['code']),
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'privateKey',
          label: 'Private Key / Secret Key',
          type: 'password',
          placeholder: 'Ej: sk_test_...',
          hint: 'Nunca compartas esta clave',
          visibleWhen: (v) =>
            [
              'CULQI',
              'NIUBIZ',
              'IZIPAY',
              'STRIPE',
              'PAGO_EFECTIVO',
              'SAFETY_PAY',
              'MERCADO_PAGO',
            ].includes(v['code']),
          validators: [Validators.required],
          cols: 2,
        },
        // ── Solo Niubiz, Izipay y PagoEfectivo ───────────────────
        {
          key: 'merchantId',
          label: 'Merchant ID / Tienda ID',
          type: 'text',
          placeholder: 'Ej: 123456789',
          hint: 'Identificador único de tu comercio en el proveedor',
          visibleWhen: (v) =>
            ['NIUBIZ', 'IZIPAY', 'PAGO_EFECTIVO'].includes(v['code']),
          validators: [Validators.required],
          cols: 2,
        },
        // ── Solo PagoEfectivo ─────────────────────────────────────
        {
          key: 'expirationHours',
          label: 'Horas de expiración del código',
          type: 'number',
          placeholder: '24',
          hint: 'Tiempo en horas antes de que el código de pago expire',
          visibleWhen: (v) => v['code'] === 'PAGO_EFECTIVO',
          validators: [Validators.required, Validators.min(1)],
          cols: 2,
        },
        // ── Solo Yape / Plin ──────────────────────────────────────
        {
          key: 'phoneNumber',
          label: 'Número de celular para recibir pagos',
          type: 'text',
          placeholder: '+51 999 999 999',
          hint: 'Número asociado a tu cuenta Yape o Plin',
          visibleWhen: (v) => v['code'] === 'YAPE_PLIN_MANUAL',
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'ownerName',
          label: 'Nombre del titular de la cuenta',
          type: 'text',
          placeholder: 'Ej: Juan Pérez',
          visibleWhen: (v) => v['code'] === 'YAPE_PLIN_MANUAL',
          validators: [Validators.required],
          cols: 2,
        },
        // ── Siempre visible ───────────────────────────────────────
        {
          key: 'instructions',
          label: 'Instrucciones para el cliente en el checkout',
          type: 'textarea',
          placeholder:
            'Ej: Escanea el QR y envía el comprobante por WhatsApp...',
          hint: 'Estas instrucciones se muestran al cliente al elegir este método',
          cols: 4,
        },
      ],
    },
  ];
}
