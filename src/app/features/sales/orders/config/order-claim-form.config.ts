import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { firstValueFrom } from 'rxjs';

/**
 * Configuración del formulario de reclamación de pedido.
 *
 * Campos del backend (CreateOrderClaimDto):
 *   - type: ClaimType (requerido)
 *   - reasonCategory: ClaimReasonCategory (requerido)
 *   - description: string (opcional)
 *   - customerVoucherAmount: number (opcional, solo en STORE_ERROR/PRODUCT_FAULT)
 *   - tempImageIds: string[] (opcional, hasta 3 imágenes)
 *   - adminNotes: string (opcional, notas internas)
 */
export function buildClaimFormConfig(
  imageUpload: ImageUploadService,
): FormStepConfig[] {
  return [
    {
      title: 'Información de la Reclamación',
      fields: [
        // ── Tipo de Reclamación ──────────────────────────────────────
        {
          key: 'type',
          label: 'Tipo de Reclamación',
          type: 'select',
          placeholder: 'Seleccionar tipo...',
          validators: [Validators.required],
          options: [
            { label: 'Cancelación', value: 'CANCELLATION' },
            { label: 'Devolución con Reembolso', value: 'REFUND' },
            { label: 'Reemplazo', value: 'REPLACEMENT' },
          ],
          cols: 2,
        },
        // ── Categoría de Motivo (dinámico según tipo) ────────────────
        {
          key: 'reasonCategory',
          label: 'Motivo principal',
          type: 'select',
          placeholder: 'Seleccionar categoría...',
          validators: [Validators.required],
          options: (formValue: Record<string, any>) => {
            const type = formValue['type'] as string;
            if (!type) return [];

            const optionsMap: Record<
              string,
              { label: string; value: string }[]
            > = {
              CANCELLATION: [
                { label: 'Decisión del cliente', value: 'CUSTOMER_DECISION' },
                { label: 'Error de la tienda', value: 'STORE_ERROR' },
              ],
              REFUND: [
                { label: 'Decisión del cliente', value: 'CUSTOMER_DECISION' },
                { label: 'Error de la tienda', value: 'STORE_ERROR' },
                { label: 'Falla del producto', value: 'PRODUCT_FAULT' },
              ],
              REPLACEMENT: [
                { label: 'Error de la tienda', value: 'STORE_ERROR' },
                { label: 'Falla del producto', value: 'PRODUCT_FAULT' },
              ],
            };

            return optionsMap[type] || [];
          },
          cols: 2,
        },
        // ── Descripción del problema ─────────────────────────────────
        {
          key: 'description',
          label: 'Descripción del problema',
          type: 'textarea',
          placeholder: 'Describe detalladamente el motivo de la reclamación...',
          validators: [Validators.maxLength(500)],
          cols: 4,
        },
        // ── Monto del voucher (condicional) ──────────────────────────
        {
          key: 'customerVoucherAmount',
          label: 'Monto del voucher del cliente',
          type: 'number-decimal',
          placeholder: '0.00',
          hint: 'Monto que el cliente pagó por el envío de retorno (aplica solo en STORE_ERROR o PRODUCT_FAULT)',
          validators: [Validators.min(0)],
          min: 0,
          minFractionDigits: 2,
          visibleWhen: (formValue: Record<string, any>) => {
            const reason = formValue['reasonCategory'] as string;
            return reason === 'STORE_ERROR' || reason === 'PRODUCT_FAULT';
          },
          cols: 2,
        },
      ],
    },
    {
      title: 'Evidencia Fotográfica',
      fields: [
        // ── Galería de imágenes (evidencia del reclamo) ───────────────
        {
          key: 'tempImageIds',
          label: 'Imágenes de evidencia',
          type: 'file-gallery',
          accept: 'image/*',
          maxFileSize: 5_000_000, // 5MB
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
      ],
    },
    {
      title: 'Notas Internas',
      fields: [
        // ── Notas administrativas (no visibles al cliente) ───────────
        {
          key: 'adminNotes',
          label: 'Notas internas (Admin)',
          type: 'textarea',
          placeholder:
            'Notas para el equipo interno (no visibles al cliente)...',
          validators: [Validators.maxLength(500)],
          cols: 4,
        },
      ],
    },
  ];
}

/**
 * Constante de conveniencia con uploadHandler vacío.
 * Usar `buildClaimFormConfig(imageUpload)` en producción.
 */
export const CLAIM_FORM_CONFIG: FormStepConfig[] = buildClaimFormConfig(
  null as any,
);
