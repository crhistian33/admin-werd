import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { CategoryStore } from '../../store/category.store';
import { CATEGORY_FORM_CONFIG } from '../../config/category-form.config';

@Component({
  selector: 'app-category-form',
  imports: [FormDynamicComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent {
  private router = inject(Router);

  readonly store = inject(CategoryStore);
  readonly fields = CATEGORY_FORM_CONFIG;

  id = input.required<number>();
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
      this.store.update(Number(this.store.selected()?.id), data, () => this.goBack());
    } else {
      this.store.create(data, () => this.goBack());
    }
  }

  goBack(): void {
    this.router.navigate(['/catalogos/categorias']);
  }
}
