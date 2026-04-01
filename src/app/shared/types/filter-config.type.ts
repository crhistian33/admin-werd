export type FilterFieldType = 'select' | 'date-range' | 'boolean' | 'text';

export interface FilterOption {
  label: string;
  value: any;
  severity?: string; // Reutilizamos el color del badge si existe
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: FilterOption[];
  placeholder?: string;
}
