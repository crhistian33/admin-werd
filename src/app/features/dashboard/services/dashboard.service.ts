import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  DashboardData,
  DashboardApiResponse,
  DashboardQueryParams,
} from '../models/dashboard-response.model';
import { IS_PUBLIC } from '@core/auth/context/auth.context';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getDashboard(params: DashboardQueryParams = {}): Observable<DashboardData> {
    let httpParams = new HttpParams();
    if (params.startDate)
      httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);

    return this.http
      .get<DashboardApiResponse>(this.baseUrl, {
        params: httpParams,
        context: new HttpContext().set(IS_PUBLIC, false),
      })
      .pipe(map((res) => res.data));
  }
}
