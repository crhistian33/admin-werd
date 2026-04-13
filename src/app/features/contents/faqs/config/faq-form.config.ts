import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';

export function buildFaqFormConfig(): FormStepConfig[] {
  return [
    {
      title: 'Información general',
      fields: [
        {
          key: 'question',
          label: 'Pregunta',
          type: 'text',
          placeholder: 'Ej: ¿Cómo puedo realizar un pedido?',
          validators: [Validators.required, Validators.minLength(3)],
          cols: 4,
        },
        {
          key: 'answer',
          label: 'Respuesta',
          type: 'textarea',
          placeholder: 'Respuesta a la pregunta',
          validators: [Validators.required],
          cols: 4,
        },
        {
          key: 'category',
          label: 'Categoría',
          type: 'select',
          options: [
            { value: 'general', label: 'General' },
            { value: 'shipping', label: 'Envío' },
            { value: 'payment', label: 'Pago' },
            { value: 'none', label: 'Ninguno' },
          ],
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'sortOrder',
          label: 'Orden',
          type: 'number',
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'isActive',
          label: 'Activo',
          type: 'checkbox',
          showOnCreate: false,
          cols: 1,
        },
      ],
    },
  ];
}
