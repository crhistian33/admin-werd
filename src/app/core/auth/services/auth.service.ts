import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LoginPayload } from '../models/auth-request.interface';
import { Observable } from 'rxjs';
import {
  AuthResponse,
  RefreshResponse,
} from '../models/auth-response.interface';
import { ApiResponse } from '@shared/models/api-response.model';
import { IS_PUBLIC } from '../context/auth.context';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth/admin`;

  private get authOptions() {
    return {
      withCredentials: true, // Gestiona la cookie HttpOnly
      context: new HttpContext().set(IS_PUBLIC, true), // Salta el interceptor
    };
  }

  login(payload: LoginPayload): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/login`,
      payload,
      this.authOptions,
    );
  }

  refreshToken(): Observable<ApiResponse<RefreshResponse>> {
    return this.http.post<ApiResponse<RefreshResponse>>(
      `${this.baseUrl}/refresh`,
      {},
      this.authOptions,
    );
  }

  logout(): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(
      `${this.baseUrl}/logout`,
      {},
      {
        withCredentials: true, // Gestiona la cookie HttpOnly
      },
    );
  }

  logoutAll(): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(
      `${this.baseUrl}/logout-all`,
      {},
      {
        withCredentials: true, // Gestiona la cookie HttpOnly
      },
    );
  }
}
