export type ColumnType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'badge'
  | 'image'
  | 'actions';

export type BadgeConfig = {
  value: string;
  label: string;
  severity: 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';
};

export type TableColumn<T = any> = {
  field: keyof T | string;
  header: string;
  type?: ColumnType; // default: 'text'
  sortable?: boolean; // default: false
  width?: string; // ej: '120px', '10%'
  badges?: BadgeConfig[]; // para type: 'badge'
  format?: (value: any, row: T) => string; // formato custom
};

export type TableAction<T = any> = {
  icon: string;
  tooltip: string;
  severity?: 'success' | 'warn' | 'danger' | 'info' | 'secondary';
  visible?: (row: T) => boolean;
  action: (row: T) => void;
};

export type DataTableConfig<T = any> = {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  pageSize?: number; // default: 10
  pageSizeOptions?: number[]; // default: [10, 25, 50]
  globalFilter?: boolean; // default: true
  showFilter?: boolean; // default: true
  selectable?: boolean; // default: false
  dataKey?: string; // default: 'id'
};
