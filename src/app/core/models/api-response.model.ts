export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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
