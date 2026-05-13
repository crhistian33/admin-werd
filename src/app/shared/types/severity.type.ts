export type Severity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast'
  | 'primary';

export type TagSeverity = Exclude<Severity, 'primary'>;
