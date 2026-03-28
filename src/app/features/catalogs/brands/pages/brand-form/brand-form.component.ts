import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { BrandStore } from '../../store/brand.store';
import { BRAND_FORM_CONFIG } from '../../config/brand-form.config';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';

@Component({
  selector: 'app-brand-form',
  imports: [FormDynamicComponent],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss',
})
export class BrandFormComponent {
  private router = inject(Router);

  readonly store = inject(BrandStore);
  readonly fields = BRAND_FORM_CONFIG;

  id = input.required<string>();
  isEdit = false;

  ngOnInit(): void {
    if (this.id()) {
      this.isEdit = true;
      this.store.getById(this.id());
    } else {
      this.store.setSelected(null);
    }
  }

  onSubmit(data: Record<string, any>): void {
    if (this.isEdit) {
      this.store.update(this.id(), data, () => this.goBack());
    } else {
      this.store.create(data, () => this.goBack());
    }
  }

  goBack(): void {
    this.router.navigate(['/catalogos/marcas']);
  }
}
