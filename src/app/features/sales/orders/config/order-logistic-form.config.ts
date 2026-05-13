// src/app/features/sales/orders/config/order-logistics-form.config.ts

import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { firstValueFrom } from 'rxjs';

/**
 * Configuración del formulario de logística de pedido.
 *
 * Campos del backend (UpdateLogisticsDto):
 *   - deliveryType: DeliveryType (requerido)
 *   - courierName: string (requerido solo si COURIER)
 *   - trackingNumber: string (requerido solo si COURIER)
 *   - actualShippingCost: number (opcional)
 *   - internalTransportCost: number (opcional)
 *   - tempImageIds: string[] (opcional, evidencia de empaque)
 */
export function buildLogisticsFormConfig(
  imageUpload: ImageUploadService,
): FormStepConfig[] {
  const step1Fields: FormStepConfig['fields'] = [
    {
      key: 'deliveryType',
      label: 'Tipo de despacho',
      type: 'select',
      placeholder: 'Seleccionar tipo...',
      validators: [Validators.required],
      options: [
        { label: 'Courier / Agencia', value: 'COURIER' },
        { label: 'Motorizado Local', value: 'LOCAL_MOTORIZED' },
      ],
      cols: 4,
    },
    {
      key: 'courierName',
      label: 'Nombre del Courier',
      type: 'text',
      placeholder: 'Ej: Olva Courier, Shalom, etc.',
      validators: [Validators.required],
      visibleWhen: (formValue: Record<string, any>) => {
        return formValue['deliveryType'] === 'COURIER';
      },
      cols: 2,
    },
    {
      key: 'trackingNumber',
      label: 'Número de Tracking / Guía',
      type: 'text',
      placeholder: 'Ej: ABC-123456',
      validators: [Validators.required],
      visibleWhen: (formValue: Record<string, any>) => {
        return formValue['deliveryType'] === 'COURIER';
      },
      hint: 'Obligatorio para envíos por agencia o courier externo',
      cols: 2,
    },
  ];

  const step2Fields: FormStepConfig['fields'] = [
    {
      key: 'actualShippingCost',
      label: 'Costo real del envío',
      type: 'number-decimal',
      placeholder: '0.00',
      hint: 'Gasto real pagado al courier o motorizado',
      validators: [Validators.min(0)],
      min: 0,
      minFractionDigits: 2,
      cols: 2,
    },
    {
      key: 'internalTransportCost',
      label: 'Gasto primera milla',
      type: 'number-decimal',
      placeholder: '0.00',
      hint: 'Traslado del almacén al punto de despacho',
      validators: [Validators.min(0)],
      min: 0,
      minFractionDigits: 2,
      cols: 2,
    },
  ];

  const step3Fields: FormStepConfig['fields'] = [
    {
      key: 'tempImageIds',
      label: 'Foto de empaque',
      type: 'file-gallery',
      accept: 'image/*',
      maxFileSize: 5_000_000,
      uploadHandler: (file: File) =>
        firstValueFrom(
          imageUpload.uploadTemp(
            file,
            ImageEntityType.ORDER_LOGISTICS,
            'shipping_evidence',
          ),
        ).then((res) => res.data.imageId),
      hint: 'Evidencia fotográfica de cómo se envió el paquete',
      cols: 4,
    },
  ];

  return [
    {
      title: 'Despacho',
      fields: step1Fields,
    },
    {
      title: 'Costos de Envío',
      fields: step2Fields,
    },
    {
      title: 'Evidencia de Empaque',
      fields: step3Fields,
    },
  ];
}

/**
 * Constante de conveniencia con uploadHandler vacío.
 * Usar `buildLogisticsFormConfig(imageUpload)` en producción.
 */
// export const LOGISTICS_FORM_CONFIG: FormStepConfig[] = buildLogisticsFormConfig(
//   null as any,
// );
