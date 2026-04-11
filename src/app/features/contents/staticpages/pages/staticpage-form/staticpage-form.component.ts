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

  id = input<string | null>(null);
  readonly isEdit = computed(() => !!this.id());

  // initialData como computed — no se recrea en cada ciclo de detección de cambios
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
    console.log('Data', data);
    if (this.isEdit()) {
      this.store.update(this.id()!, data, () => this.goBack());
    } else {
      this.store.create(data, () => this.goBack());
    }
  }

  goBack(): void {
    void this.router.navigate(['/contenidos/paginas-internas']);
  }
}
