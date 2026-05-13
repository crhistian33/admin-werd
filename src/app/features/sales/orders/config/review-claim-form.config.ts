import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';

export function buildReviewClaimFormConfig(): FormStepConfig[] {
  const fields: FormStepConfig['fields'] = [
    {
      key: 'action',
      label: 'Acción',
      type: 'select',
      placeholder: 'Seleccionar acción...',
      validators: [Validators.required],
      options: [
        { label: 'Aprobar', value: 'APPROVED' },
        { label: 'Rechazar', value: 'REJECTED' },
      ],
      cols: 4,
    },
    {
      key: 'reviewNote',
      label: 'Nota para el cliente',
      type: 'textarea',
      placeholder: 'Mensaje que recibirá el cliente...',
      validators: (formValue: Record<string, any>) => {
        return formValue['action'] === 'REJECTED' ? [Validators.required] : [];
      },
      hint: 'Obligatorio si se rechaza el reclamo',
      cols: 4,
    },
    {
      key: 'internalNote',
      label: 'Notas internas',
      type: 'textarea',
      placeholder: 'Notas para el equipo administrativo...',
      cols: 4,
    },
  ];

  return [
    {
      title: 'Revisión de Reclamo',
      fields,
    },
  ];
}
