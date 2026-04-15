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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ShippingZoneStore extends BaseStore<ShippingZone> {
  protected readonly service = inject(ShippingZonesService);

  override readonly filter = signal<ShippingZoneFilter>(
    shippingZoneFilterDefaults(),
  );

  constructor() {
    super({ useSoftDelete: true });
  }

  changeStatus(ids: string[], status: boolean, onSuccess?: () => void) {
    this.isSaving.set(true);
    this.service
      .changeStatus(ids, status)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.dialog.success(
            res.message || 'Actualización de estados realizados',
            'Operación exitosa',
          );
          this.reloadActive();
          onSuccess?.();
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
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
