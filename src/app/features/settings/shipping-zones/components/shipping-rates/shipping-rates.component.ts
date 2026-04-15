import { Component, inject, input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-shipping-rates',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './shipping-rates.component.html',
  styleUrl: './shipping-rates.component.scss',
})
export class ShippingRatesComponent {
  private readonly fb = inject(FormBuilder);

  field = input.required<FormFieldConfig>();
  formArray = input.required<FormArray>();

  addRate(): void {
    const template = this.field().template || {};
    this.formArray().push(this.fb.group(template));
    this.formArray().markAsDirty();
  }

  removeRate(index: number): void {
    this.formArray().removeAt(index);
    this.formArray().markAsDirty();
  }
}
