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
  return [
    {
      title: 'Información de Despacho',
      fields: [
        // ── Tipo de Despacho ────────────────────────────────────────
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
          cols: 2,
        },
        // ── Nombre del Courier (condicional) ────────────────────────
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
        // ── Número de Tracking (condicional) ────────────────────────
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
      ],
    },
    {
      title: 'Costos de Envío',
      fields: [
        // ── Costo real del envío ────────────────────────────────────
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
        // ── Costo de transporte interno ─────────────────────────────
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
      ],
    },
    {
      title: 'Evidencia de Empaque',
      fields: [
        // ── Foto de empaque ─────────────────────────────────────────
        {
          key: 'tempImageIds',
          label: 'Foto de empaque',
          type: 'file-image',
          accept: 'image/*',
          maxFileSize: 5_000_000, // 5MB
          uploadHandler: (file: File) =>
            firstValueFrom(
              imageUpload.uploadTemp(
                file,
                ImageEntityType.ORDER_LOGISTICS,
                'shipping_evidence',
              ),
            ).then((res) => res.data.imageId),
          hint: 'Evidencia fotográfica de cómo salió el paquete',
          cols: 2,
        },
      ],
    },
    {
      title: 'Notas Internas',
      fields: [
        // ── Notas de logística ──────────────────────────────────────
        {
          key: 'notes',
          label: 'Notas internas de logística',
          type: 'textarea',
          placeholder: 'Observaciones sobre el despacho...',
          validators: [Validators.maxLength(500)],
          cols: 4,
        },
      ],
    },
  ];
}

/**
 * Constante de conveniencia con uploadHandler vacío.
 * Usar `buildLogisticsFormConfig(imageUpload)` en producción.
 */
export const LOGISTICS_FORM_CONFIG: FormStepConfig[] = buildLogisticsFormConfig(
  null as any,
);
