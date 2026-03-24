import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LoginPayload } from '../models/auth-request.interface';
import { Observable } from 'rxjs';
import {
  AuthResponse,
  RefreshResponse,
} from '../models/auth-response.interface';
import { ApiResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth/admin`;

  login(payload: LoginPayload): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/login`,
      payload,
      {
        withCredentials: true, // necesario para enviar/recibir la httpOnly cookie
      },
    );
  }

  refreshToken(): Observable<ApiResponse<RefreshResponse>> {
    return this.http.post<ApiResponse<RefreshResponse>>(
      `${this.baseUrl}/refresh`,
      {},
      { withCredentials: true },
    );
  }

  logout(): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true },
    );
  }

  logoutAll(): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(
      `${this.baseUrl}/logout-all`,
      {},
      { withCredentials: true },
    );
  }
}
