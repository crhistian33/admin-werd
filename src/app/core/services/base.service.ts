import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export abstract class BaseService<T> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly endpoint: string;

  get url(): string {
    return `${environment.apiUrl}/api/${this.endpoint}`;
  }

  create(payload: Partial<T>): Observable<T> {
    return this.http.post<T>(this.url, payload);
  }

  update(id: number, payload: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.url, { body: ids });
  }
}
