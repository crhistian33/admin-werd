import { Component, inject, input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-products-features',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: './products-features.component.html',
  styleUrl: './products-features.component.scss',
})
export class ProductsFeaturesComponent {
  private readonly fb = inject(FormBuilder);

  field = input.required<FormFieldConfig>();
  formArray = input.required<FormArray>();

  addFeature(): void {
    const template = this.field().template || {};
    this.formArray().push(this.fb.group(template));
    this.formArray().markAsDirty();
  }

  removeFeature(index: number): void {
    this.formArray().removeAt(index);
    this.formArray().markAsDirty();
  }
}
