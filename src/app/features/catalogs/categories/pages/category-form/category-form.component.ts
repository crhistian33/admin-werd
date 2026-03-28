import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { CategoryStore } from '../../store/category.store';
import { buildCategoryFormConfig } from '../../config/category-form.config';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import {
  getDisplayUrl,
  getImageByRole,
} from '@shared/images/interfaces/image.interface';

@Component({
  selector: 'app-category-form',
  imports: [FormDynamicComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly imageUpload = inject(ImageUploadService);
  readonly store = inject(CategoryStore);

  fields: FormFieldConfig[] = buildCategoryFormConfig(this.imageUpload);

  id = input<string | null>(null);
  readonly isEdit = computed(() => !!this.id());

  // initialData como computed — no se recrea en cada ciclo de detección de cambios
  readonly initialData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    const mainImage = getImageByRole(selected.images ?? [], 'main');

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
      this.fields = this.fields.filter((f) => f.showOnCreate !== false);
      this.store.setSelected(null);
    }
  }

  onSubmit(data: Record<string, any>): void {
    // Extrae los campos internos que no van al backend
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
      this.store.update(this.id()!, payload, () => this.goBack());
    } else {
      this.store.create(payload, () => this.goBack());
    }
  }

  goBack(): void {
    void this.router.navigate(['/catalogos/categorias']);
  }
}
