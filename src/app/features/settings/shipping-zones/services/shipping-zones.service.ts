import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { ShippingZone } from '../models/shipping.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.model';
import { Department, District, Province } from '../models/ubigeo.model';

@Injectable({
  providedIn: 'root',
})
export class ShippingZonesService extends BaseService<ShippingZone> {
  protected readonly endpoint = 'shipping-zones';

  getDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(
      `${this.url}/ubigeo/departments`,
      {
        context: this.context,
      },
    );
  }

  getProvinces(departmentId: string): Observable<ApiResponse<Province[]>> {
    return this.http.get<ApiResponse<Province[]>>(
      `${this.url}/ubigeo/departments/${departmentId}/provinces`,
      { context: this.context },
    );
  }

  getDistricts(provinceId: string): Observable<ApiResponse<District[]>> {
    return this.http.get<ApiResponse<District[]>>(
      `${this.url}/ubigeo/provinces/${provinceId}/districts`,
      { context: this.context },
    );
  }
}
