import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { REASON_CATEGORY_LABELS } from '../models/order-claim.model';

export function buildMarkClaimReceivedFormConfig(
  reasonCategory?: string,
): FormStepConfig[] {
  const fields: FormStepConfig['fields'] = [
    {
      key: 'info',
      type: 'info',
      label: '',
      defaultValue: reasonCategory
        ? REASON_CATEGORY_LABELS[reasonCategory] || reasonCategory
        : 'No especificado',
      cols: 4,
    },
    {
      key: 'productCondition',
      label: 'Estado del producto recibido',
      type: 'select',
      placeholder: 'Seleccionar condición...',
      validators: [Validators.required],
      options: [
        { label: 'Revendible - En buen estado', value: 'RESELLABLE' },
        { label: 'Dañado - No apto para venta', value: 'DAMAGED' },
        { label: 'Destruido - Baja total', value: 'DESTROYED' },
      ],
      cols: 4,
    },
    {
      key: 'internalDamageNote',
      label: 'Descripción del daño',
      type: 'textarea',
      placeholder: 'Describa el estado del producto recibido...',
      validators: [],
      visibleWhen: (formValue: Record<string, any>) => {
        const condition = formValue['productCondition'];
        return condition === 'DAMAGED' || condition === 'DESTROYED';
      },
      cols: 4,
    },
    {
      key: 'adminNote',
      label: 'Nota para el cliente',
      type: 'textarea',
      placeholder: 'Mensaje que verá el cliente...',
      validators: [],
      cols: 4,
    },
  ];

  return [
    {
      title: 'Recepción del Producto',
      fields,
    },
  ];
}
