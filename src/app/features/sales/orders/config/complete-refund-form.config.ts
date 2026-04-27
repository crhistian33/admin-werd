import { Validators } from '@angular/forms';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { firstValueFrom } from 'rxjs';

export function buildCompleteRefundFormConfig(
  imageUpload: ImageUploadService,
  isCardPayment: boolean = false,
): FormStepConfig[] {
  const fields: FormStepConfig['fields'] = [
    {
      key: 'refundMethod',
      label: 'Método de reembolso',
      type: 'select',
      placeholder: 'Seleccionar método...',
      validators: [Validators.required],
      options: [
        {
          label: '💰 Método de pago original',
          value: 'ORIGINAL_PAYMENT_METHOD',
        },
        { label: '🎁 Crédito en tienda', value: 'STORE_CREDIT' },
        { label: '🏦 Transferencia bancaria', value: 'BANK_TRANSFER' },
      ],
      cols: 4,
    },
    // ✅ NUEVO: Evidencia de reembolso (siempre disponible)
    {
      key: 'tempImageIds',
      label: 'Comprobante de reembolso',
      type: 'file-image',
      accept: 'image/*',
      maxFileSize: 5_000_000,
      uploadHandler: (file: File) =>
        firstValueFrom(
          imageUpload.uploadTemp(
            file,
            ImageEntityType.ORDER_REFUND,
            'refund_evidence',
          ),
        ).then((res) => res.data.imageId),
      hint: 'Adjunta una captura del comprobante de reembolso (transferencia, voucher, etc.)',
      cols: 2,
    },
    {
      key: 'adminNotes',
      label: 'Notas internas',
      type: 'textarea',
      placeholder: 'Notas sobre el reembolso...',
      validators: [],
      cols: 4,
    },
  ];

  // ✅ Solo mostrar gatewayRefundId si el pago fue con tarjeta
  if (isCardPayment) {
    // Insertar después de refundMethod, antes de adminNotes
    fields.splice(1, 0, {
      key: 'gatewayRefundId',
      label: 'ID de reembolso en pasarela',
      type: 'text',
      placeholder: 'Ej: ref_abc123xyz',
      validators: [],
      visibleWhen: (formValue: Record<string, any>) => {
        return formValue['refundMethod'] === 'ORIGINAL_PAYMENT_METHOD';
      },
      hint: 'ID generado por Culqi/Pasarela al procesar el reembolso',
      cols: 2,
    });
  }

  return [
    {
      title: 'Procesar Reembolso',
      fields,
    },
  ];
}
