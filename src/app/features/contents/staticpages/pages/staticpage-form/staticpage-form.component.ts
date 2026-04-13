import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PageStore } from '../../store/page.store';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { buildPageFormConfig } from '../../config/staticpage-form.config';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';

@Component({
  selector: 'app-staticpage-form',
  imports: [FormDynamicComponent],
  templateUrl: './staticpage-form.component.html',
  styleUrl: './staticpage-form.component.scss',
})
export class StaticpageFormComponent {
  private readonly router = inject(Router);
  readonly store = inject(PageStore);

  steps: FormStepConfig[] = buildPageFormConfig();

  readonly id = input<string | null>(null);
  readonly from = input<string | null>(null);
  readonly isEdit = computed(() => !!this.id());

  readonly initialData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    return {
      id: selected.id,
      title: selected.title,
      content: selected.content,
      status: selected.status,
      metaTitle: selected.metaTitle,
      metaDescription: selected.metaDescription,
    };
  });

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.store.getById(id);
    } else {
      this.steps = this.steps.map((s) => ({
        ...s,
        fields: s.fields.filter((f) => f.showOnCreate !== false),
      }));
      this.store.setSelected(null);
    }
  }

  onSubmit(data: Record<string, any>): void {
    if (this.isEdit()) {
      this.store.update(this.id()!, data, () => this._goBack());
    } else {
      this.store.create(data, () => this._goBack());
    }
  }

  _goBack(): void {
    const currentId = this.id();
    const from = this.from();

    if (from === 'detail' && currentId) {
      void this.router.navigate(['/contenidos/paginas-internas', currentId]);
    } else {
      void this.router.navigate(['/contenidos/paginas-internas']);
    }
  }
}
