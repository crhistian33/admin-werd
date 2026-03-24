import { Validators } from '@angular/forms';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';

export const PRODUCT_FORM_CONFIG: FormFieldConfig[] = [
  {
    key: 'sku',
    label: 'SKU',
    type: 'text',
    placeholder: 'Ej: SKU-001',
    validators: [Validators.required, Validators.minLength(3)],
    cols: 1,
  },
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ej: Perfume para hombre',
    validators: [Validators.required, Validators.minLength(3)],
    cols: 1,
  },
  {
    key: 'price',
    label: 'Precio',
    type: 'number',
    placeholder: 'Ej: 100',
    validators: [Validators.required, Validators.minLength(3)],
    cols: 1,
  },
  {
    key: 'stock',
    label: 'Stock',
    type: 'number',
    placeholder: 'Ej: 100',
    validators: [Validators.required, Validators.minLength(3)],
    cols: 1,
  },
];
