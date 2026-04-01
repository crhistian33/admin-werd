import { Validators } from '@angular/forms';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import { firstValueFrom } from 'rxjs';

export function buildCategoryFormConfig(
  imageUpload: ImageUploadService,
): FormFieldConfig[] {
  return [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ej: Tecnología',
      validators: [Validators.required, Validators.minLength(3)],
      cols: 1,
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Describe la categoría...',
      validators: [Validators.required],
      cols: 1,
    },
    {
      key: 'tempImageId',
      label: 'Imagen',
      type: 'file-image',
      accept: 'image/*',
      maxFileSize: 2000000,
      cols: 1,
      // Sube al /temp y retorna el UUID que irá en el payload
      uploadHandler: (file: File) =>
        firstValueFrom(imageUpload.uploadTemp(file, 'category', 'main')).then(
          (res) => res.data.imageId,
        ),
    },
    {
      key: 'isActive',
      label: 'Activo',
      type: 'checkbox',
      cols: 1,
      showOnCreate: false, // Solo mostrar en edición
    },
  ];
}
