import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';

export function buildMarkClaimReceivedFormConfig(): FormStepConfig[] {
  return [
    {
      title: 'Recepción del Producto',
      fields: [
        {
          key: 'productCondition',
          label: 'Estado del producto recibido',
          type: 'select',
          placeholder: 'Seleccionar condición...',
          validators: [Validators.required],
          options: [
            { label: '✅ Revendible - En buen estado', value: 'RESELLABLE' },
            { label: '⚠️ Dañado - No apto para venta', value: 'DAMAGED' },
            { label: '❌ Destruido - Baja total', value: 'DESTROYED' },
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
      ],
    },
  ];
}
