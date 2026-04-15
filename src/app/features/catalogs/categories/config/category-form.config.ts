import { Validators } from '@angular/forms';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { firstValueFrom } from 'rxjs';

export function buildCategoryFormConfig(
  imageUpload: ImageUploadService,
): FormStepConfig[] {
  return [
    {
      title: 'Información general',
      fields: [
        {
          key: 'name',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Ej: Tecnología',
          validators: [Validators.required, Validators.minLength(3)],
          cols: 3,
        },
        {
          key: 'description',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Describe la categoría...',
          cols: 3,
        },
        {
          key: 'isActive',
          label: 'Activo',
          type: 'switch',
          cols: 3,
          showOnCreate: false, // Solo mostrar en edición
        },
      ],
    },
    {
      title: 'Cargar imagen(es)',
      fields: [
        {
          key: 'tempImageId',
          label: 'Imagen',
          type: 'file-image',
          accept: 'image/*',
          maxFileSize: 2000000,
          cols: 1,
          // Sube al /temp y retorna el UUID que irá en el payload
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(file, 'category', 'main'),
            ).then((res) => res.data.imageId),
        },
      ],
    },
  ];
}
