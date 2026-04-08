import { DetailViewConfig } from '@shared/types/detail-view.type';
import { environment } from '@env/environment';

export const PRODUCT_DETAIL_CONFIG: DetailViewConfig = {
  sections: [
    // ── Fila 1: galería + info principal ──────────────────────
    {
      layout: 'gallery',
      fields: [
        {
          key: 'images',
          label: 'Imágenes',
          type: 'gallery',
          imageBaseUrl: environment.apiImagesUrl,
        },
      ],
    },
    {
      layout: 'info',
      title: 'Información principal',
      fields: [
        {
          key: 'sku',
          label: 'SKU',
          type: 'text',
          format: (val) => val ?? '—',
        },
        {
          key: 'status',
          label: 'Estado',
          type: 'badge',
          badges: [
            { value: 'active', label: 'Publicado', severity: 'success' },
            { value: 'inactive', label: 'Inactivo', severity: 'danger' },
            { value: 'draft', label: 'Borrador', severity: 'warn' },
            { value: 'out_of_stock', label: 'Agotado', severity: 'secondary' },
          ],
        },
        {
          key: 'shortDescription',
          label: 'Descripción corta',
          type: 'text',
          visible: (item) => !!item['shortDescription'],
        },
        {
          key: 'category.name',
          label: 'Categoría',
          type: 'text',
        },
        {
          key: 'brand.name',
          label: 'Marca',
          type: 'text',
        },
        {
          key: 'stock',
          label: 'Stock',
          type: 'number',
        },
        {
          key: 'weight',
          label: 'Peso (kg)',
          type: 'number',
          visible: (item) => !!item['weight'],
        },
        {
          key: 'isFeatured',
          label: 'Destacado',
          type: 'boolean',
          badges: [
            { value: true, label: 'Sí', severity: 'info' },
            { value: false, label: 'No', severity: 'secondary' },
          ],
        },
        {
          key: 'updatedAt',
          label: 'Última actualización',
          type: 'date',
          dateFormat: 'dd/MM/yyyy HH:mm',
        },
      ],
    },

    // ── Fila 2: precio ────────────────────────────────────────
    {
      layout: 'price',
      title: 'Precio',
      span: 2, // ocupa toda la fila para lucir mejor
      fields: [
        {
          key: 'price',
          label: 'Precio',
          type: 'price-block',
          priceKey: 'price.price',
          costKey: 'price.cost',
          compareKey: 'price.compareAtPrice',
        },
      ],
    },

    // ── Fila 3: descripción completa ──────────────────────────
    {
      layout: 'html',
      title: 'Descripción',
      span: 2,
      fields: [
        {
          key: 'description',
          label: 'Descripción',
          type: 'html',
          visible: (item) => !!item['description'],
        },
      ],
    },

    // ── Fila 4: specs + features ──────────────────────────────
    {
      layout: 'specs',
      title: 'Especificaciones técnicas',
      fields: [
        {
          key: 'specs',
          label: 'Especificaciones',
          type: 'specs',
          visible: (item) => !!item['specs']?.length,
        },
      ],
    },
    {
      layout: 'features',
      title: 'Características',
      fields: [
        {
          key: 'features',
          label: 'Características',
          type: 'features',
          visible: (item) => !!item['features']?.length,
        },
      ],
    },

    // ── Fila 5: SEO ───────────────────────────────────────────
    {
      layout: 'info',
      title: 'SEO',
      span: 2,
      fields: [
        {
          key: 'metaTitle',
          label: 'Meta título',
          type: 'text',
          visible: (item) => !!item['metaTitle'],
        },
        {
          key: 'metaDescription',
          label: 'Meta descripción',
          type: 'text',
          visible: (item) => !!item['metaDescription'],
        },
        {
          key: 'slug',
          label: 'Slug',
          type: 'text',
        },
      ],
    },
  ],
};
