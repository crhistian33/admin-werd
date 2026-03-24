import { inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { IS_PUBLIC } from '@core/auth/context/auth.context';

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

  create(payload: Partial<T>): Observable<T> {
    return this.http.post<T>(this.url, payload, { context: this.context });
  }

  update(id: number, payload: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.url}/${id}`, payload, {
      context: this.context,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, {
      context: this.context,
    });
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.url, {
      body: ids,
      context: this.context,
    });
  }
}
