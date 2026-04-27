import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { OrderStatus } from '../models/orders.enum';

export function buildCancelOrderFormConfig(
  orderStatus: OrderStatus,
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

  return [
    {
      title: 'Cancelar Pedido',
      fields: [
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
      ],
    },
  ];
}
