import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { Page } from '../models/page.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class PagesService extends BaseService<Page> {
  protected readonly endpoint = 'pages';

  changeStatusPage(
    ids: string[],
    status: string,
  ): Observable<ApiResponse<Page>> {
    return this.http.patch<ApiResponse<Page>>(
      `${this.url}/bulk/status`,
      { ids, status },
      { context: this.context },
    );
  }
}
