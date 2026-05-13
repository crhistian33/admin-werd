import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { firstValueFrom } from 'rxjs';

/**
 * Configuración del formulario de reclamo de pedido.
 *
 * Campos del backend (CreateOrderClaimDto):
 *   - type: ClaimType (requerido)
 *   - reasonCategory: ClaimReasonCategory (requerido)
 *   - description: string (opcional)
 *   - customerVoucherAmount: number (opcional, solo en STORE_ERROR/PRODUCT_FAULT)
 *   - tempImageIds: string[] (opcional, hasta 3 imágenes)
 *   - adminNotes: string (opcional, notas internas)
 */
import { OrderItem } from '../models/order.model';
export function buildClaimFormConfig(
  imageUpload: ImageUploadService,
  orderStatus: string = 'paid',
  items: OrderItem[] = [],
): FormStepConfig[] {
  const availableTypes = getAvailableClaimTypes();

  const step1Fields: FormStepConfig['fields'] = [
    {
      key: 'type',
      label: 'Tipo de Reclamo',
      type: 'select',
      placeholder: 'Seleccionar tipo...',
      validators: [Validators.required],
      options: availableTypes,
      cols: 2,
    },
    {
      key: 'reasonCategory',
      label: 'Motivo principal',
      type: 'select',
      placeholder: 'Seleccionar categoría...',
      validators: [Validators.required],
      options: [
        { label: 'Decisión del cliente', value: 'CUSTOMER_DECISION' },
        { label: 'Error de la tienda', value: 'STORE_ERROR' },
        { label: 'Falla del producto', value: 'PRODUCT_FAULT' },
      ],
      cols: 2,
    },
    {
      key: 'items',
      label: 'Productos afectados',
      type: 'order-items-selector',
      options: items,
      validators: [Validators.required, Validators.minLength(1)],
      cols: 4,
    },
    {
      key: 'description',
      label: 'Descripción del problema',
      type: 'textarea',
      placeholder: 'Describe detalladamente el motivo del reclamo...',
      validators: [Validators.required, Validators.maxLength(500)],
      cols: 4,
    },
  ];

  const step2Fields: FormStepConfig['fields'] = [
    {
      key: 'tempImageIds',
      label: 'Imágenes de evidencia',
      type: 'file-gallery',
      accept: 'image/*',
      maxFileSize: 5_000_000,
      uploadHandler: (file: File) =>
        firstValueFrom(
          imageUpload.uploadTemp(
            file,
            ImageEntityType.ORDER_CLAIM,
            'customer_evidence',
          ),
        ).then((res) => res.data.imageId),
      hint: 'Puedes subir hasta 3 imágenes como evidencia del reclamo',
      cols: 4,
    },
    {
      key: 'adminNotes',
      label: 'Notas internas (Admin)',
      type: 'textarea',
      placeholder: 'Notas para el equipo interno...',
      validators: [Validators.maxLength(500)],
      cols: 4,
    },
    {
      key: 'autoApprove',
      label: 'Aprobar automáticamente',
      type: 'checkbox',
      defaultValue: true,
      cols: 4,
    },
  ];

  return [
    {
      title: 'Información General',
      fields: step1Fields,
    },
    {
      title: 'Evidencias y Notas',
      fields: step2Fields,
    },
  ];
}

function getAvailableClaimTypes(): { label: string; value: string }[] {
  return [
    { label: 'Devolución con Reembolso', value: 'REFUND' },
    { label: 'Reemplazo', value: 'REPLACEMENT' },
  ];
}

// export const CLAIM_FORM_CONFIG: FormStepConfig[] = buildClaimFormConfig(
//   null as any,
//   'paid',
// );
