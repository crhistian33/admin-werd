import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { PaymentMethodStore } from '../../store/payment-method.store';
import {
  buildPaymentMethodFormConfig,
  CONFIG_FIELDS_BY_CODE,
} from '../../config/payment-method-form.confiog';

@Component({
  selector: 'app-payment-method-form',
  standalone: true,
  imports: [FormDynamicComponent],
  templateUrl: './payment-method-form.component.html',
})
export class PaymentMethodFormComponent implements OnInit {
  private readonly router = inject(Router);
  readonly store = inject(PaymentMethodStore);

  readonly id = input<string | null>(null);
  readonly isEdit = computed(() => !!this.id());

  readonly steps = computed<FormStepConfig[]>(() => {
    const config = buildPaymentMethodFormConfig();

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
      code: selected.code,
      type: selected.type,
      sortOrder: selected.sortOrder,
      isActive: selected.isActive,
      instructions: selected.instructions,
      // Aplanar config al nivel raíz para que el form lo reciba
      publicKey: selected.config?.publicKey ?? null,
      privateKey: selected.config?.privateKey ?? null,
      merchantId: selected.config?.merchantId ?? null,
      expirationHours: selected.config?.expirationHours ?? null,
      phoneNumber: selected.config?.phoneNumber ?? null,
      ownerName: selected.config?.ownerName ?? null,
    };
  });

  ngOnInit(): void {
    if (this.id()) this.store.getById(this.id()!);
    else this.store.setSelected(null);
  }

  onSubmit(data: Record<string, any>): void {
    const {
      publicKey,
      privateKey,
      merchantId,
      expirationHours,
      phoneNumber,
      ownerName,
      instructions,
      ...rest
    } = data;

    // Campos posibles en config
    const allConfigFields: Record<string, any> = {
      publicKey,
      privateKey,
      merchantId,
      expirationHours,
      phoneNumber,
      ownerName,
    };

    // Solo incluir los campos que corresponden al proveedor seleccionado
    const relevantFields = CONFIG_FIELDS_BY_CODE[data['code']] ?? [];
    const config: Record<string, any> = {};
    relevantFields.forEach((field) => {
      if (
        allConfigFields[field] !== null &&
        allConfigFields[field] !== undefined
      ) {
        config[field] = allConfigFields[field];
      }
    });

    const payload: Record<string, any> = {
      ...rest,
      instructions: instructions ?? null,
      config,
    };

    if (this.isEdit()) {
      this.store.update(this.id()!, payload, () => this._goBack());
    } else {
      this.store.create(payload, () => this._goBack());
    }
  }

  _goBack(): void {
    void this.router.navigate(['/configuraciones/metodos-pago']);
  }
}
