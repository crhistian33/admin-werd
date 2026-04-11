import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';

export function buildPageFormConfig(): FormStepConfig[] {
  return [
    {
      title: 'Información general',
      fields: [
        {
          key: 'title',
          label: 'Título',
          type: 'text',
          placeholder: 'Ej: Políticas internas',
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
          ],
          cols: 3,
        },
        {
          key: 'content',
          label: 'Contenido',
          type: 'editor',
          placeholder: 'Contenido de la página',
          validators: [Validators.required],
          cols: 3,
        },
        // ── Sección 2: SEO ────────────────────────────────────────────────
        {
          key: 'metaTitle',
          label: 'Meta título (SEO)',
          type: 'text',
          placeholder: 'Ej: Políticas internas de WERD',
          hint: 'Recomendado: 50–60 caracteres',
          validators: [Validators.maxLength(70)],
          cols: 3,
        },
        {
          key: 'metaDescription',
          label: 'Meta descripción (SEO)',
          type: 'textarea',
          placeholder: 'Breve descripción para buscadores',
          hint: 'Recomendado: 150–160 caracteres',
          validators: [Validators.maxLength(170)],
          cols: 3,
        },
        // ── Sección 3: Estado ────────────────────────────────────────────────
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { label: 'Publicado', value: 'published' },
            { label: 'Borrador', value: 'draft' },
          ],
          showOnCreate: false,
          cols: 3,
        },
      ],
    },
  ];
}
