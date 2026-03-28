/**
 * Tipos de columna soportados en el DataTable
 */
export type ColumnType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'badge'
  | 'image'
  | 'actions';

/**
 * Configuración para mostrar un valor como badge/etiqueta
 */
export type BadgeConfig = {
  value: string;
  label: string;
  severity: 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';
};

/**
 * Configuración para una columna en la tabla
 * @template T Tipo de dato de la fila
 */
export type TableColumn<T = any> = {
  /** Campo del objeto (soporta ruta: 'address.city') */
  field: keyof T | string;
  /** Encabezado visible */
  header: string;
  /** Tipo de visualización (default: 'text') */
  type?: ColumnType;
  /** Permitir ordenamiento (default: false) */
  sortable?: boolean;
  /** Ancho personalizado (ej: '120px', '10%') */
  width?: string;
  /** Configuración de badges para type: 'badge' */
  badges?: BadgeConfig[];
  /** Función para formatear el valor (ej: toUpperCase, custom format) */
  format?: (value: any, row: T) => string;
};

/**
 * Configuración para una acción en la columna de acciones
 * @template T Tipo de dato de la fila
 */
export type TableAction<T = any> = {
  /** Clase del ícono (ej: 'pi pi-pencil') */
  icon: string;
  /** Texto del tooltip */
  tooltip: string;
  /** Severidad del botón (default: 'secondary') */
  severity?: 'success' | 'warn' | 'danger' | 'info' | 'secondary';
  /** Control de visibilidad condicional (default: siempre visible) */
  visible?: (row: T) => boolean;
  /** Función ejecutada al hacer clic */
  action: (row: T) => void;
};

/**
 * Configuración principal de la tabla
 * @template T Tipo de dato de las filas
 *
 * @example
 * ```ts
 * const config: DataTableConfig<Product> = {
 *   columns: [...],
 *   actions: [...],
 *   pageSize: 10,        // Registros por página (default: 10)
 *   pageSizeOptions: [10, 25, 50],  // Opciones del dropdown (default)
 *   globalFilter: true,  // Mostrar buscador (default: true)
 *   showFilter: false,   // Mostrar botón de filtros avanzados (default: false)
 *   selectable: true,    // Checkboxes para multi-select (default: false)
 *   dataKey: 'id',       // Campo único para keys (default: 'id')
 * };
 * ```
 */
export type DataTableConfig<T = any> = {
  // Estructura
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];

  // Paginación (ESTANDARIZADO A 10 POR DEFECTO)
  /** Registros por página. Default: 10. No se recomienda cambiar. */
  pageSize?: number;
  /** Opciones disponibles al cambiar rows per page. Default: [10, 25, 50] */
  pageSizeOptions?: number[];

  // Comportamiento
  /** Mostrar campo de búsqueda global (default: true) */
  globalFilter?: boolean;
  /** Mostrar botón de filtros avanzados (default: false) */
  showFilter?: boolean;
  /** Habilitar checkboxes para selección (default: false) */
  selectable?: boolean;

  // Metadata
  /** Campo único para rastrear filas (default: 'id') */
  dataKey?: string;
};
