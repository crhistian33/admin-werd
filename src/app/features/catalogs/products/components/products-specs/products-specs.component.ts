import { Component, inject, input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-products-specs',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: './products-specs.component.html',
  styleUrl: './products-specs.component.scss',
})
export class ProductsSpecsComponent {
  private readonly fb = inject(FormBuilder);

  field = input.required<FormFieldConfig>();
  formArray = input.required<FormArray>();

  addSpec(): void {
    const template = this.field().template || {};
    this.formArray().push(this.fb.group(template));
    this.formArray().markAsDirty();
  }

  removeSpec(index: number): void {
    this.formArray().removeAt(index);
    this.formArray().markAsDirty();
  }
}
