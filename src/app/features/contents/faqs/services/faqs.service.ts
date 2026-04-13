import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { Faq } from '../models/faq.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class FaqsService extends BaseService<Faq> {
  protected readonly endpoint = 'faqs';

  reorder(ids: string[]): Observable<ApiResponse<Faq[]>> {
    return this.http.patch<ApiResponse<Faq[]>>(
      `${this.url}/bulk/reorder`,
      { ids },
      { context: this.context },
    );
  }
}
