import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { FaqStore } from '../../store/faq.store';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { buildFaqFormConfig } from '../../config/faq-form.config';

@Component({
  selector: 'app-faq-form',
  imports: [FormDynamicComponent],
  templateUrl: './faq-form.component.html',
  styleUrl: './faq-form.component.scss',
})
export class FaqFormComponent {
  private readonly router = inject(Router);
  readonly store = inject(FaqStore);

  readonly id = input<string | null>(null);
  readonly from = input<string | null>(null);
  readonly isEdit = computed(() => !!this.id());

  readonly initialData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    return {
      id: selected.id,
      question: selected.question,
      answer: selected.answer,
      category: selected.category,
      sortOrder: selected.sortOrder,
      isActive: selected.isActive,
    };
  });

  readonly steps = computed<FormStepConfig[]>(() => {
    const config = buildFaqFormConfig();

    if (!this.isEdit()) {
      return config.map((s) => ({
        ...s,
        fields: s.fields.filter((f) => f.showOnCreate !== false),
      }));
    }

    return config;
  });

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.store.getById(id);
    } else {
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
      void this.router.navigate([
        '/contenidos/preguntas-frecuentes',
        currentId,
      ]);
    } else {
      void this.router.navigate(['/contenidos/preguntas-frecuentes']);
    }
  }
}
