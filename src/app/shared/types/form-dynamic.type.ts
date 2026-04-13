import { ValidatorFn } from '@angular/forms';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'editor'
  | 'number'
  | 'password'
  | 'number-decimal'
  | 'select'
  | 'email'
  | 'url'
  | 'file-image'
  | 'file-gallery'
  | 'checkbox'
  | 'switch'
  | 'features'
  | 'specs'
  | 'date';

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  validators?: ValidatorFn[];
  options?: SelectOption[] | ((formValue: any) => SelectOption[]);
  accept?: string;
  maxFileSize?: number;
  cols?: 1 | 2 | 3 | 4;
  /** Para inputs numéricos: valor mínimo permitido */
  min?: number;
  /** Para inputs numéricos: valor máximo permitido */
  max?: number;
  /** Cantidad de decimales a mostrar en number-decimal (default: 2) */
  minFractionDigits?: number;

  // Para campos file-image que deben subir al /temp antes de guardar.
  // Recibe el File seleccionado y retorna el tempImageId (UUID).
  // Si no se provee, el comportamiento por defecto guarda el File en el control.
  uploadHandler?: (file: File) => Promise<string>;

  /**
   * Si es true, el campo solo se muestra en modo creación (cuando initialData es null).
   * Si es false, solo en edición. Si es undefined, siempre se muestra.
   */
  showOnCreate?: boolean;
  /**
   * Función que determina si el campo debe ser visible.
   * Recibe el valor actual del formulario y retorna true si debe mostrarse, false en caso contrario.
   */
  visibleWhen?: (formValue: Record<string, any>) => boolean;
}

export interface FormStepConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
}
