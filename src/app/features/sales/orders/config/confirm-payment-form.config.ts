import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';

export function buildConfirmPaymentFormConfig(): FormStepConfig[] {
  return [
    {
      title: 'Confirmar Pago',
      fields: [
        {
          key: 'operationNumber',
          label: 'Número de operación',
          type: 'text',
          placeholder: 'Ej: YAP-2025042200123',
          validators: [Validators.required],
          hint: 'Código de 6-8 dígitos para YAPE/PLIN o número de operación bancaria',
          cols: 4,
        },
        {
          key: 'paidAmount',
          label: 'Monto recibido',
          type: 'number-decimal',
          placeholder: '0.00',
          validators: [Validators.required, Validators.min(0)],
          min: 0,
          minFractionDigits: 2,
          cols: 2,
        },
        {
          key: 'adminNotes',
          label: 'Notas internas',
          type: 'textarea',
          placeholder: 'Notas para el equipo de finanzas...',
          validators: [],
          cols: 4,
        },
      ],
    },
  ];
}
