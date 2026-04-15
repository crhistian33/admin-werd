import { Component, computed, inject, input } from '@angular/core';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { buildShippingZoneFormConfig } from '../../config/shipping-zone-form.config';
import { Router } from '@angular/router';
import { ShippingZoneStore } from '../../store/shipping-zone.store';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ShippingRate, ShippingZoneArea } from '../../models/shipping.model';

@Component({
  selector: 'app-shipping-zone-form',
  imports: [FormDynamicComponent],
  templateUrl: './shipping-zone-form.component.html',
  styleUrl: './shipping-zone-form.component.scss',
})
export class ShippingZoneFormComponent {
  private readonly router = inject(Router);
  readonly store = inject(ShippingZoneStore);

  readonly id = input<string | null>(null);
  readonly from = input<string | null>(null);

  readonly isEdit = computed(() => !!this.id());

  readonly steps = computed<FormStepConfig[]>(() => {
    const config = buildShippingZoneFormConfig();

    if (!this.isEdit()) {
      return config.map((s) => ({
        ...s,
        fields: s.fields.filter((f) => f.showOnCreate !== false),
      }));
    }

    return config;
  });

  readonly initialData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    return {
      id: selected.id,
      name: selected.name,
      description: selected.description,
      isActive: selected.isActive,
      rates: (selected.rates ?? []).map((rate: ShippingRate) => ({
        ...rate,
        price: rate.price != null ? Number(rate.price) : 0,
        minOrderAmount:
          rate.minOrderAmount != null ? Number(rate.minOrderAmount) : 0,
        freeShippingThreshold:
          rate.freeShippingThreshold != null
            ? Number(rate.freeShippingThreshold)
            : null,
        estimatedMin: rate.estimatedMin != null ? Number(rate.estimatedMin) : 1,
        estimatedMax: rate.estimatedMax != null ? Number(rate.estimatedMax) : 3,
      })),
      areas: (selected.areas ?? []).map((area: ShippingZoneArea) => ({
        ...area,
        departmentId: area.departmentId,
        provinceId: area.provinceId,
        districtId: area.districtId,
      })),
    };
  });

  ngOnInit(): void {
    if (this.id()) this.store.getById(this.id()!);
    else this.store.setSelected(null);
  }

  onSubmit(data: Record<string, any>): void {
    const payload = {
      ...data,
      rates: (data['rates'] ?? []).map((rate: any) => ({
        ...rate,
        sortOrder: rate.sortOrder != null ? Number(rate.sortOrder) : 0,
        price: rate.price != null ? Number(rate.price) : 0,
        minOrderAmount:
          rate.minOrderAmount != null ? Number(rate.minOrderAmount) : 0,
        freeShippingThreshold:
          rate.freeShippingThreshold != null
            ? Number(rate.freeShippingThreshold)
            : null,
        estimatedMin: rate.estimatedMin != null ? Number(rate.estimatedMin) : 0,
        estimatedMax:
          rate.estimatedMax != null ? Number(rate.estimatedMax) : null,
      })),
      areas: (data['areas'] ?? []).map((area: any) => ({
        ...area,
        departmentId: area.departmentId,
        provinceId: area.provinceId || null,
        districtId: area.districtId || null,
      })),
    };

    if (this.isEdit()) {
      this.store.update(this.id()!, payload, () => this._goBack());
    } else {
      this.store.create(payload, () => this._goBack());
    }
  }

  _goBack(): void {
    const currentId = this.id();
    const from = this.from();

    if (from === 'detail' && currentId) {
      void this.router.navigate(['/configuraciones/zonas-envio', currentId]);
    } else {
      void this.router.navigate(['/configuraciones/zonas-envio']);
    }
  }
}
