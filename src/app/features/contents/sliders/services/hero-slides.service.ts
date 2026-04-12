import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { HeroSlide } from '../models/hero-slide.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class HeroSlidesService extends BaseService<HeroSlide> {
  protected readonly endpoint = 'hero-slides';

  reorder(ids: string[]): Observable<ApiResponse<HeroSlide[]>> {
    return this.http.patch<ApiResponse<HeroSlide[]>>(
      `${this.url}/bulk/reorder`,
      { ids },
      { context: this.context },
    );
  }
}
