export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: ApiMeta;
  error?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  code: number;
  error: string;
  message?: string;
  path?: string;
  timestamp?: string;
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
