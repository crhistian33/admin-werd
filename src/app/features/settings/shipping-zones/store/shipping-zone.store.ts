import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { ShippingZone } from '../models/shipping.model';
import { ShippingZonesService } from '../services/shipping-zones.service';
import {
  ShippingZoneFilter,
  shippingZoneFilterDefaults,
} from '../models/shipping-filter.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ShippingZoneStore extends BaseStore<ShippingZone> {
  protected readonly service = inject(ShippingZonesService);

  override readonly filter = signal<ShippingZoneFilter>(
    shippingZoneFilterDefaults(),
  );

  constructor() {
    super({ useSoftDelete: true });
  }

  // Ubigeo
  departments = signal<any[]>([]);

  loadDepartments(): void {
    this.service.getDepartments().subscribe((res) => {
      this.departments.set(res.data);
    });
  }

  getProvinces(departmentId: string): Observable<ApiResponse<any[]>> {
    return this.service.getProvinces(departmentId);
  }

  getDistricts(provinceId: string): Observable<ApiResponse<any[]>> {
    return this.service.getDistricts(provinceId);
  }
}
