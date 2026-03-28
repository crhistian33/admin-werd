import { ValidatorFn } from '@angular/forms';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'email'
  | 'url'
  | 'file-image'
  | 'checkbox';

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
  accept?: string;
  maxFileSize?: number;
  cols?: 1 | 2;

  // Para campos file-image que deben subir al /temp antes de guardar.
  // Recibe el File seleccionado y retorna el tempImageId (UUID).
  // Si no se provee, el comportamiento por defecto guarda el File en el control.
  uploadHandler?: (file: File) => Promise<string>;

  /**
   * Si es true, el campo solo se muestra en modo creación (cuando initialData es null).
   * Si es false, solo en edición. Si es undefined, siempre se muestra.
   */
  showOnCreate?: boolean;
}
