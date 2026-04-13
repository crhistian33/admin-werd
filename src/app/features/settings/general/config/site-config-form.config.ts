import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { firstValueFrom } from 'rxjs';

export const CURRENCY_OPTIONS = [
  { label: 'Sol peruano (PEN)', value: 'PEN' },
  { label: 'Dólar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
];

export function buildSiteConfigFormConfig(
  imageUpload: ImageUploadService,
): FormStepConfig[] {
  return [
    {
      title: 'Información general',
      fields: [
        {
          key: 'storeName',
          label: 'Nombre de la tienda',
          type: 'text',
          placeholder: 'Ej: Mi Tienda Online',
          validators: [Validators.required],
          cols: 2,
        },
        {
          key: 'storeEmail',
          label: 'Email principal',
          type: 'email',
          placeholder: 'contacto@mitienda.com',
          validators: [Validators.required, Validators.email],
          cols: 2,
        },
        {
          key: 'supportEmail',
          label: 'Email de soporte',
          type: 'email',
          placeholder: 'soporte@mitienda.com',
          validators: [Validators.email],
          cols: 2,
        },
        {
          key: 'phonePrimary',
          label: 'Teléfono principal',
          type: 'text',
          placeholder: '+51 999 999 999',
          cols: 1,
        },
        {
          key: 'phoneSecondary',
          label: 'Teléfono secundario',
          type: 'text',
          placeholder: '+51 999 999 999',
          cols: 1,
        },
        {
          key: 'whatsappNumber',
          label: 'WhatsApp',
          type: 'text',
          placeholder: '+51999999999',
          hint: 'Sin espacios ni guiones',
          cols: 2,
        },
        {
          key: 'address',
          label: 'Dirección',
          type: 'text',
          placeholder: 'Av. Principal 123, Lima',
          cols: 2,
        },
      ],
    },
    {
      title: 'Logos',
      fields: [
        {
          key: 'tempLogoHeaderId',
          label: 'Logo cabecera',
          type: 'file-image',
          accept: 'image/*',
          maxFileSize: 2_000_000,
          hint: 'SVG o PNG con fondo transparente. Recomendado: 200x60px',
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(file, 'site_config', 'logo_header'),
            ).then((res) => res.data.imageId),
          cols: 2,
        },
        {
          key: 'tempLogoFooterId',
          label: 'Logo pie de página',
          type: 'file-image',
          accept: 'image/*',
          maxFileSize: 2_000_000,
          hint: 'SVG o PNG con fondo transparente. Recomendado: 200x60px',
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(file, 'site_config', 'logo_footer'),
            ).then((res) => res.data.imageId),
          cols: 2,
        },
      ],
    },
    {
      title: 'Configuración comercial',
      fields: [
        {
          key: 'currency',
          label: 'Moneda',
          type: 'select',
          options: CURRENCY_OPTIONS,
          validators: [Validators.required],
          cols: 1,
        },
        {
          key: 'taxRate',
          label: 'Tasa de impuesto (IGV)',
          type: 'number-decimal',
          placeholder: '0.18',
          hint: 'Ej: 0.18 para 18%',
          validators: [
            Validators.required,
            Validators.min(0),
            Validators.max(1),
          ],
          minFractionDigits: 2,
          cols: 1,
        },
      ],
    },
    {
      title: 'SEO',
      fields: [
        {
          key: 'metaTitle',
          label: 'Meta título',
          type: 'text',
          placeholder: 'Ej: Mi Tienda — Los mejores productos',
          hint: 'Recomendado: 50–60 caracteres',
          validators: [Validators.maxLength(70)],
          cols: 3,
        },
        {
          key: 'metaDescription',
          label: 'Meta descripción',
          type: 'textarea',
          placeholder: 'Descripción breve para buscadores',
          hint: 'Recomendado: 150–160 caracteres',
          validators: [Validators.maxLength(170)],
          cols: 3,
        },
      ],
    },
    // {
    //   title: 'Analítica',
    //   fields: [
    //     {
    //       key: 'googleAnalyticsId',
    //       label: 'Google Analytics ID',
    //       type: 'text',
    //       placeholder: 'G-XXXXXXXXXX',
    //       cols: 2,
    //     },
    //     {
    //       key: 'facebookPixelId',
    //       label: 'Facebook Pixel ID',
    //       type: 'text',
    //       placeholder: '1234567890',
    //       cols: 2,
    //     },
    //   ],
    // },
  ];
}
