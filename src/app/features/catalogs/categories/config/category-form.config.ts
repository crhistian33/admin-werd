import { Validators } from '@angular/forms';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';

export const CATEGORY_FORM_CONFIG: FormFieldConfig[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ej: Tecnología',
    validators: [Validators.required, Validators.minLength(3)],
    cols: 1,
  },
  {
    key: 'description',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Describe la categoría...',
    validators: [Validators.required],
    cols: 1,
  },
  {
    key: 'image',
    label: 'Imagen',
    type: 'file-image',
    accept: 'image/*',
    maxFileSize: 2000000,
    cols: 1,
  },
];
