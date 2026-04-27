import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { firstValueFrom } from 'rxjs';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';

export function buildBrandFormConfig(
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
          cols: 1,
        },
        {
          key: 'description',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Describe la marca...',
          cols: 1,
        },
        {
          key: 'isActive',
          label: 'Activo',
          type: 'checkbox',
          cols: 1,
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
              imageUpload.uploadTemp(file, ImageEntityType.BRAND, 'logo'),
            ).then((res) => res.data.imageId),
        },
      ],
    },
  ];
}
