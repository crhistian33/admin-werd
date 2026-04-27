import { Validators } from '@angular/forms';
import { Category } from '@features/catalogs/categories/models/category.model';
import { Product } from '@features/catalogs/products/models/product.model';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { firstValueFrom } from 'rxjs';

export function buildHeroSlideFormConfig(
  imageUpload: ImageUploadService,
  options: {
    products: Product[];
    categories: Category[];
  },
): FormStepConfig[] {
  return [
    {
      title: 'Información general',
      fields: [
        {
          key: 'title',
          label: 'Título',
          type: 'text',
          placeholder: 'Ej: Oferta del día',
          validators: [Validators.required, Validators.minLength(3)],
          cols: 2,
        },
        {
          key: 'subtitle',
          label: 'Subtítulo',
          type: 'text',
          placeholder: 'Ej: Hasta 50% de descuento',
          cols: 2,
        },
        {
          key: 'linkType',
          label: 'Tipo de enlace',
          type: 'select',
          options: [
            { value: 'product', label: 'Producto' },
            { value: 'category', label: 'Categoría' },
            { value: 'external', label: 'Externo' },
            { value: 'none', label: 'Ninguno' },
          ],
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'linkProductId',
          label: 'Producto',
          type: 'select',
          placeholder: 'Buscar producto...',
          options: options.products.map((p) => ({
            label: p.name,
            value: p.id,
          })),
          cols: 2,
          visibleWhen: (v) => v['linkType'] === 'product', // ← condicional
        },
        {
          key: 'linkCategoryId',
          label: 'Categoría',
          type: 'select',
          placeholder: 'Seleccionar categoría...',
          options: options.categories.map((c) => ({
            label: c.name,
            value: c.id,
          })),
          cols: 2,
          visibleWhen: (v) => v['linkType'] === 'category',
        },
        {
          key: 'linkUrl',
          label: 'URL externa',
          type: 'url',
          placeholder: 'https://...',
          cols: 2,
          visibleWhen: (v) => v['linkType'] === 'external',
        },
        // {
        //   key: 'linkText',
        //   label: 'Texto del botón CTA',
        //   type: 'text',
        //   placeholder: 'Ej: Ver más, Comprar ahora',
        //   cols: 1,
        //   // visible en product, category y external — no en none
        //   visibleWhen: (v) => v['linkType'] !== 'none',
        // },
        {
          key: 'startsAt',
          label: 'Fecha de inicio',
          type: 'date',
          cols: 2,
        },
        {
          key: 'endsAt',
          label: 'Fecha de finalización',
          type: 'date',
          cols: 2,
        },
        {
          key: 'sortOrder',
          label: 'Orden',
          type: 'number',
          placeholder: 'Ej: 1',
          validators: [Validators.required],
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
          key: 'tempDesktopImageId',
          label: 'Imagen para desktop',
          type: 'file-image',
          accept: 'image/*',
          maxFileSize: 2000000,
          cols: 2,
          // Sube al /temp y retorna el UUID que irá en el payload
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(
                file,
                ImageEntityType.HERO_SLIDE,
                'desktop',
              ),
            ).then((res) => res.data.imageId),
        },
        {
          key: 'tempMobileImageId',
          label: 'Imagen para mobile',
          type: 'file-image',
          accept: 'image/*',
          maxFileSize: 2000000,
          cols: 2,
          // Sube al /temp y retorna el UUID que irá en el payload
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(
                file,
                ImageEntityType.HERO_SLIDE,
                'mobile',
              ),
            ).then((res) => res.data.imageId),
        },
      ],
    },
  ];
}
