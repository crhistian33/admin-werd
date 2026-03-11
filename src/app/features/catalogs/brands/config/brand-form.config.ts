import { Validators } from '@angular/forms';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';

export const BRAND_FORM_CONFIG: FormFieldConfig[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ej: Ohm',
    validators: [Validators.required, Validators.minLength(3)],
    cols: 1,
  },
  {
    key: 'image',
    label: 'Logo',
    type: 'file-image',
    accept: 'image/*',
    maxFileSize: 2000000,
    cols: 1,
  },
];
