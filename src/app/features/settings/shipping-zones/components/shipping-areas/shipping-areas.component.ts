import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import { ShippingZoneStore } from '../../store/shipping-zone.store';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-areas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, ButtonModule],
  templateUrl: './shipping-areas.component.html',
  styleUrl: './shipping-areas.component.scss',
})
export class ShippingAreasComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly store = inject(ShippingZoneStore);

  field = input.required<FormFieldConfig>();
  formArray = input.required<FormArray>();

  // Usamos maps para guardar las listas por índice del FormArray
  provincesMap = signal<Record<number, any[]>>({});
  districtsMap = signal<Record<number, any[]>>({});

  ngOnInit(): void {
    if (this.store.departments().length === 0) {
      this.store.loadDepartments();
    }

    // Cargar provincias y distritos para los items existentes (si los hay)
    this.formArray().controls.forEach((control, index) => {
      const deptId = control.get('departmentId')?.value;
      const provId = control.get('provinceId')?.value;
      
      if (deptId) {
        this.loadProvinces(index, deptId);
        control.get('provinceId')?.enable();
      } else {
        control.get('provinceId')?.disable();
      }

      if (provId) {
        this.loadDistricts(index, provId);
        control.get('districtId')?.enable();
      } else {
        control.get('districtId')?.disable();
      }
    });
  }

  onDepartmentChange(index: number, departmentId: string): void {
    const control = this.formArray().at(index);
    // Resetear hijos
    control.get('provinceId')?.setValue(null);
    control.get('districtId')?.setValue(null);

    // Limpiar mapas
    this.provincesMap.update((prev) => ({ ...prev, [index]: [] }));
    this.districtsMap.update((prev) => ({ ...prev, [index]: [] }));

    if (departmentId) {
      this.loadProvinces(index, departmentId);
      control.get('provinceId')?.enable();
    } else {
      control.get('provinceId')?.disable();
    }
    control.get('districtId')?.disable();
  }

  loadProvinces(index: number, departmentId: string): void {
    this.store.getProvinces(departmentId).subscribe((res) => {
      this.provincesMap.update((prev) => ({ ...prev, [index]: res.data }));
    });
  }

  onProvinceChange(index: number, provinceId: string): void {
    const control = this.formArray().at(index);
    // Resetear hijo
    control.get('districtId')?.setValue(null);

    // Limpiar mapa
    this.districtsMap.update((prev) => ({ ...prev, [index]: [] }));

    if (provinceId) {
      this.loadDistricts(index, provinceId);
      control.get('districtId')?.enable();
    } else {
      control.get('districtId')?.disable();
    }
  }

  loadDistricts(index: number, provinceId: string): void {
    this.store.getDistricts(provinceId).subscribe((res) => {
      this.districtsMap.update((prev) => ({ ...prev, [index]: res.data }));
    });
  }

  addArea(): void {
    const template = this.field().template || {
      departmentId: [null],
      provinceId: [{ value: null, disabled: true }],
      districtId: [{ value: null, disabled: true }],
    };
    this.formArray().push(this.fb.group(template));
    this.formArray().markAsDirty();
  }

  removeArea(index: number): void {
    this.formArray().removeAt(index);
    // Limpiar mapas para evitar leaks
    this.provincesMap.update(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    this.districtsMap.update(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    this.formArray().markAsDirty();
  }
}
