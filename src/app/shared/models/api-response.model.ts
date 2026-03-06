export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
}
