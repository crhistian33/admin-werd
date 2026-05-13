import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { OrderStatus } from '../models/orders.enum';
import { OrderItem } from '../models/order.model';
import { REFUND_METHOD_LABELS } from '../models';

export function buildCancelOrderFormConfig(
  orderStatus: OrderStatus,
  items: OrderItem[] = [],
  needsRefund: boolean = false,
  isCardPayment: boolean = false,
): FormStepConfig[] {
  const isPaid = orderStatus === 'paid' || orderStatus === 'processing';

  const allReasons = [
    { label: 'Cliente solicitó cancelación', value: 'customer_request' },
    { label: 'Producto sin stock', value: 'no_stock' },
    { label: 'Sospecha de fraude', value: 'fraud' },
    { label: 'Error en dirección de envío', value: 'wrong_address' },
    { label: 'Producto dañado en almacén', value: 'damaged_in_warehouse' },
    { label: 'Otro', value: 'other' },
  ];

  const reasons = isPaid
    ? allReasons
    : [{ label: 'Pago no recibido', value: 'no_payment' }, ...allReasons];

  const fields: FormStepConfig['fields'] = [
    {
      key: 'reason',
      label: 'Motivo de cancelación',
      type: 'select',
      placeholder: 'Seleccionar motivo...',
      validators: [Validators.required],
      options: reasons,
      cols: 4,
    },
    {
      key: 'isFullCancellation',
      label: '¿Cancelar toda la orden?',
      type: 'switch',
      defaultValue: true,
      cols: 4,
    },
    {
      key: 'items',
      label: 'Seleccionar ítems a cancelar',
      type: 'order-items-selector',
      options: items,
      visibleWhen: (formValue) => formValue['isFullCancellation'] === false,
      validators: (formValue: Record<string, any>) => {
        return formValue['isFullCancellation'] === false
          ? [Validators.required]
          : [];
      },
      cols: 4,
    },
    {
      key: 'reasonDetail',
      label: 'Detalle adicional',
      type: 'textarea',
      placeholder: 'Información adicional sobre la cancelación...',
      validators: [],
      cols: 4,
    },
    {
      key: 'adminNotes',
      label: 'Notas internas',
      type: 'textarea',
      placeholder: 'Notas para el equipo...',
      validators: [],
      cols: 4,
    },
    {
      key: 'refundMethod',
      label: 'Método de reembolso',
      type: 'select',
      validators: [Validators.required],
      visibleWhen: () => needsRefund,
      options: [
        ...(isCardPayment
          ? [
              {
                label: REFUND_METHOD_LABELS['CARD'],
                value: 'CARD',
              },
            ]
          : [
              {
                label: REFUND_METHOD_LABELS['WALLET'],
                value: 'WALLET',
              },
              {
                label: REFUND_METHOD_LABELS['BANK_TRANSFER'],
                value: 'BANK_TRANSFER',
              },
              {
                label: REFUND_METHOD_LABELS['STORE_CREDIT'],
                value: 'STORE_CREDIT',
              },
            ]),
      ],
      defaultValue: isCardPayment ? 'CARD' : 'WALLET',
      hint: 'Método definido en el envío de retorno',
      cols: 4,
    },
    {
      key: 'refundAccountDetails',
      label: 'Datos para el reembolso',
      type: 'textarea',
      placeholder: 'Datos de cuenta...',
      validators: [],
      visibleWhen: () => needsRefund,
      hint: 'Datos proporcionados por el cliente',
      cols: 4,
    },
  ];

  return [
    {
      title: 'Cancelar Pedido',
      fields,
    },
  ];
}
