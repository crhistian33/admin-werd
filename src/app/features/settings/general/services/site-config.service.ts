import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IS_PUBLIC } from '@core/auth/context/auth.context';
import { environment } from '@env/environment';
import { SiteConfig } from '../models/site-config.model';
import { ApiResponse } from '@shared/models/api-response.model';
import { Observable } from 'rxjs';
import { SocialLink } from '../models/social-link.model';

@Injectable({
  providedIn: 'root',
})
export class SiteConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/site-config`;

  private get context(): HttpContext {
    return new HttpContext().set(IS_PUBLIC, false);
  }

  get(): Observable<ApiResponse<SiteConfig>> {
    return this.http.get<ApiResponse<SiteConfig>>(this.baseUrl, {
      context: this.context,
    });
  }

  update(payload: Partial<SiteConfig>): Observable<ApiResponse<SiteConfig>> {
    return this.http.patch<ApiResponse<SiteConfig>>(this.baseUrl, payload, {
      context: this.context,
    });
  }

  createSocialLink(
    dto: Partial<SocialLink>,
  ): Observable<ApiResponse<SocialLink>> {
    return this.http.post<ApiResponse<SocialLink>>(
      `${this.baseUrl}/social-links`,
      dto,
      { context: this.context },
    );
  }

  updateSocialLink(
    id: string,
    dto: Partial<SocialLink>,
  ): Observable<ApiResponse<SocialLink>> {
    return this.http.patch<ApiResponse<SocialLink>>(
      `${this.baseUrl}/social-links/${id}`,
      dto,
      { context: this.context },
    );
  }

  deleteSocialLink(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/social-links/${id}`,
      { context: this.context },
    );
  }

  reorderSocialLinks(ids: string[]): Observable<ApiResponse<SiteConfig>> {
    return this.http.patch<ApiResponse<SiteConfig>>(
      `${this.baseUrl}/social-links/reorder`,
      { ids },
      { context: this.context },
    );
  }
}
