import { inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { IS_PUBLIC } from '@core/auth/context/auth.context';
import { ApiResponse } from '@core/models/api-response.model';

export abstract class BaseService<T> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly endpoint: string;

  // Propiedad que puede ser sobrescrita en AuthService
  protected readonly isPublicRequest: boolean = false;

  get url(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  // Centralizamos la creación del contexto
  protected get context(): HttpContext {
    return new HttpContext().set(IS_PUBLIC, this.isPublicRequest);
  }

  create(payload: Partial<T>): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.url, payload, {
      context: this.context,
    });
  }

  update(id: string, payload: Partial<T>): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.url}/${id}`, payload, {
      context: this.context,
    });
  }

  softDelete(id: string): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.url}/${id}/soft-delete`, {
      context: this.context,
    });
  }

  softDeleteAll(ids: string[]): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.url}/bulk/soft-delete`,
      {
        ids,
      },
      {
        context: this.context,
      },
    );
  }

  delete(id: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.url}/${id}`, {
      context: this.context,
    });
  }

  deleteAll(ids: string[]): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.url}/bulk`, {
      body: { ids },
      context: this.context,
    });
  }

  restore(id: string): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.url}/${id}/restore`, {
      context: this.context,
    });
  }

  restoreAll(ids: string[]): Observable<ApiResponse<void>> {
    console.log('IDS', ids, `${this.url}/bulk/restore`);
    return this.http.patch<ApiResponse<void>>(
      `${this.url}/bulk/restore`,
      { ids },
      {
        context: this.context,
      },
    );
  }
}
