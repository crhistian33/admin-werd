import { ValidatorFn } from '@angular/forms';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'email'
  | 'url'
  | 'file-image';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  validators?: ValidatorFn[];
  options?: SelectOption[];
  cols?: 1 | 2;
  accept?: string;
  maxFileSize?: number;
}
