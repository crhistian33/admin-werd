import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { Category } from '@features/catalogs/categories/models/category.model';
import { Brand } from '@features/catalogs/brands/models/brand.model';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { firstValueFrom } from 'rxjs';

/**
 * Configuración del formulario de producto.
 *
 * La función recibe un `uploadHandler` para que la página pueda
 * inyectar el servicio de imágenes temporales sin acoplar este config.
 *
 * Campos opcionales del backend (sin `Validators.required`):
 *   shortDescription, weight, metaTitle, metaDescription,
 *   compareAtPrice, isFeatured, tempMainImageId, tempGalleryImageIds,
 *   specs, features.
 */
export function buildProductFormConfig(
  imageUpload: ImageUploadService,
  options: {
    categories: Category[];
    brands: Brand[];
  },
): FormStepConfig[] {
  return [
    {
      title: 'Información general',
      fields: [
        // ── Sección 1: Información básica ─────────────────────────────────
        {
          key: 'sku',
          label: 'SKU',
          type: 'text',
          placeholder: 'Ej: NGX-001',
          hint: 'Código único de identificación del producto',
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
          cols: 1, // 1 de 3 en desktop
        },
        {
          key: 'name',
          label: 'Nombre del producto',
          type: 'text',
          placeholder: 'Ej: Notebook Gamer X',
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
          ],
          cols: 2, // 2 de 3 en desktop
        },
        {
          key: 'shortDescription',
          label: 'Descripción corta',
          type: 'textarea',
          placeholder: 'Breve resumen visible en listados y tarjetas',
          validators: [Validators.maxLength(300)],
          cols: 3, // Ocupa toda la fila
        },

        // ── Sección 2: Precio e inventario ────────────────────────────────
        {
          key: 'price',
          label: 'Precio de venta',
          type: 'number-decimal',
          placeholder: '0.00',
          hint: 'Precio público del producto',
          validators: [Validators.required, Validators.min(0)],
          min: 0,
          minFractionDigits: 2,
          cols: 1,
        },
        {
          key: 'compareAtPrice',
          label: 'Precio de comparación',
          type: 'number-decimal',
          placeholder: '0.00',
          hint: 'Precio tachado (precio original antes del descuento)',
          validators: [Validators.min(0)],
          min: 0,
          minFractionDigits: 2,
          cols: 1,
        },
        {
          key: 'cost',
          label: 'Costo',
          type: 'number-decimal',
          placeholder: '0.00',
          hint: 'Costo de adquisición (no visible al cliente)',
          validators: [Validators.required, Validators.min(0)],
          min: 0,
          minFractionDigits: 2,
          cols: 1,
        },
        {
          key: 'stock',
          label: 'Stock',
          type: 'number',
          placeholder: '0',
          hint: 'Unidades disponibles en inventario',
          validators: [Validators.required, Validators.min(0)],
          min: 0,
          cols: 1,
        },
        {
          key: 'weight',
          label: 'Peso (kg)',
          type: 'number-decimal',
          placeholder: '0.00',
          hint: 'Usado para calcular costos de envío',
          validators: [Validators.min(0)],
          min: 0,
          minFractionDigits: 3,
          cols: 1,
        },
        {
          key: 'isFeatured',
          label: 'Producto destacado',
          type: 'switch',
          placeholder: 'Marcar como destacado en la tienda',
          cols: 1,
        },
        // ── Sección 3: Categorización ──────────────────────────────────────
        {
          key: 'categoryId',
          label: 'Categoría',
          type: 'select',
          placeholder: 'Selecciona una categoría',
          validators: [Validators.required],
          options: options.categories.map((c) => ({
            label: c.name,
            value: c.id,
          })),
          cols: 1,
        },
        {
          key: 'brandId',
          label: 'Marca',
          type: 'select',
          placeholder: 'Selecciona una marca',
          validators: [Validators.required],
          options: options.brands.map((b) => ({ label: b.name, value: b.id })),
          cols: 1,
        },
        // ── Sección 4: Descripción completa ───────────────────────────────
        {
          key: 'description',
          label: 'Descripción completa',
          type: 'editor',
          placeholder: 'Descripción detallada del producto (acepta HTML)',
          validators: [Validators.required],
          cols: 3,
        },
        // ── Sección 5: SEO ────────────────────────────────────────────────
        {
          key: 'metaTitle',
          label: 'Meta título (SEO)',
          type: 'text',
          placeholder: 'Ej: Notebook Gamer X - Las mejores especificaciones',
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
      ],
    },
    {
      title: 'Cargar imagen(es)',
      fields: [
        // ── Sección 6: Imágenes ───────────────────────────────────────────
        {
          key: 'tempMainImageId',
          label: 'Imagen principal',
          type: 'file-image',
          accept: 'image/*',
          maxFileSize: 5_000_000,
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(file, 'product', 'main'),
            ).then((res) => res.data.imageId),
          cols: 1,
        },
        {
          key: 'tempGalleryImageIds',
          label: 'Galería de imágenes',
          type: 'file-gallery',
          accept: 'image/*',
          maxFileSize: 5_000_000,
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(file, 'product', 'gallery'),
            ).then((res) => res.data.imageId),
          hint: 'Puedes subir hasta 3 imágenes adicionales',
          cols: 2, // 2 de 3
        },
      ],
    },
    {
      title: 'Especificaciones y Características',
      fields: [
        // ── Sección 7: Specs y Features ───────────────────────────────────
        {
          key: 'specs',
          label: 'Especificaciones técnicas',
          type: 'specs',
          hint: 'Arrastra para reordenar. Ej: Procesador → Intel Core i7',
          cols: 3,
        },
        {
          key: 'features',
          label: 'Características destacadas',
          type: 'features',
          hint: 'Arrastra para reordenar. Ej: Pantalla Full HD antirreflejo',
          cols: 3,
        },
      ],
    },
  ];
}

/**
 * Constante de conveniencia con uploadHandler vacío.
 * Usar `buildProductFormConfig(uploadHandler)` en producción.
 */
export const PRODUCT_FORM_CONFIG: FormStepConfig[] = buildProductFormConfig(
  null as any,
  { categories: [], brands: [] },
);
