import { FormStepConfig } from '@shared/types/form-dynamic.type';

export interface DialogDynamicConfig {
  /** Título del diálogo */
  title: string;
  /** Ancho del diálogo (default: 550px) */
  width?: string;
  /** Label del botón submit */
  submitLabel?: string;
  /** Configuración del formulario dinámico */
  formSteps: FormStepConfig[];
  /** Info contextual a mostrar arriba del form (opcional) */
  contextInfo?: Array<{ label: string; value: string; severity?: string }>;
  /** Datos iniciales (para modo edición) */
  initialData?: Record<string, any> | null;
}
