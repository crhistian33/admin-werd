import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandStore } from '../../store/brand.store';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { buildBrandFormConfig } from '../../config/brand-form.config';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import {
  getDisplayUrl,
  getImageByRole,
} from '@shared/images/interfaces/image.interface';

@Component({
  selector: 'app-brand-form',
  imports: [FormDynamicComponent],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss',
})
export class BrandFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly imageUpload = inject(ImageUploadService);
  readonly store = inject(BrandStore);

  steps: FormStepConfig[] = buildBrandFormConfig(this.imageUpload);

  readonly id = input.required<string>();
  readonly from = input<string | null>(null);
  readonly isEdit = computed(() => !!this.id());

  // initialData como computed — no se recrea en cada ciclo de detección de cambios
  readonly initialData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    const mainImage = getImageByRole(selected.images ?? [], 'logo');

    return {
      // id es necesario para que el linkedSignal de FormDynamic
      // sepa cuándo estabilizarse (undefined → uuid real)
      id: selected.id,
      name: selected.name,
      description: selected.description,
      isActive: selected.isActive,

      // El control tempImageId arranca en null — no envía la URL al backend
      tempImageId: null,

      // URL para mostrar el preview de la imagen existente
      // FormDynamicComponent la lee y la muestra sin guardarla en el control
      _currentImageUrl: mainImage ? getDisplayUrl(mainImage) : null,

      // ID del registro Image — FormDynamicComponent lo guarda en removedImageIds
      // cuando el usuario hace clic en el botón X del campo 'tempImageId'
      _currentImageId_tempImageId: mainImage?.id ?? null,
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
    const {
      _currentImageUrl,
      _currentImageId_tempImageId,
      _removedImageIds,
      tempImageId,
      ...rest
    } = data;

    const payload: Record<string, any> = { ...rest };

    // Nueva imagen seleccionada — tempImageId es un UUID del registro temp
    if (tempImageId && !String(tempImageId).startsWith('/uploads')) {
      payload['tempImageId'] = tempImageId;
    }

    // Imagen eliminada sin reemplazo — envía el ID para que el backend la elimine
    const removedId = (_removedImageIds as Record<string, string>)?.[
      'tempImageId'
    ];
    if (!tempImageId && removedId) {
      payload['removedImageId'] = removedId;
    }

    if (this.isEdit()) {
      this.store.update(this.id()!, payload, () => this._goBack());
    } else {
      this.store.create(payload, () => this._goBack());
    }
  }

  _goBack(): void {
    const currentId = this.id();
    const from = this.from();

    if (from === 'detail' && currentId) {
      void this.router.navigate(['/catalogos/marcas', currentId]);
    } else {
      void this.router.navigate(['/catalogos/marcas']);
    }
  }
}
