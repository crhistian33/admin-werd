import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { firstValueFrom } from 'rxjs';
import { REFUND_METHOD_LABELS } from '../models/order-claim.model';

export function buildConfirmReturnShipmentFormConfig(
  imageUpload: ImageUploadService,
  showVoucherField: boolean,
  isCardPayment: boolean = false,
  isRefund: boolean = false,
): FormStepConfig[] {
  const fields: FormStepConfig['fields'] = [
    {
      key: 'courierName',
      label: 'Courier / Empresa de envío',
      type: 'text',
      placeholder: 'Ej: Olva Courier, Shalom, Serpost',
      validators: [Validators.required],
      cols: 2,
    },
    {
      key: 'trackingNumber',
      label: 'Número de tracking o contacto',
      type: 'text',
      placeholder: 'Ej: TRK-123456789',
      validators: [Validators.required],
      cols: 2,
    },
    {
      key: 'refundMethod',
      label: 'Preferencia de Reembolso',
      type: 'select',
      placeholder: 'Seleccionar método...',
      options: Object.entries(REFUND_METHOD_LABELS)
        .filter(([value]) =>
          isCardPayment
            ? value === 'CARD' || value === 'STORE_CREDIT'
            : value !== 'CARD',
        )
        .map(([value, label]) => ({
          label,
          value,
        })),
      defaultValue: isCardPayment ? 'CARD' : undefined,
      visibleWhen: () => isRefund,
      validators: [Validators.required],
      cols: 4,
    },
    {
      key: 'refundAccountDetails',
      label: 'Datos para el reembolso',
      type: 'textarea',
      placeholder:
        'Ej: Banco, Tipo de Cta y Número / Nro de Celular para Yape...',
      visibleWhen: (formValue: Record<string, any>) =>
        !isCardPayment &&
        isRefund &&
        formValue['refundMethod'] !== 'CASH' &&
        formValue['refundMethod'] !== 'STORE_CREDIT',
      validators: [Validators.required],
      cols: 4,
    },
    {
      key: 'tempImageIds',
      label: 'Comprobante de envío',
      type: 'file-gallery',
      accept: 'image/*',
      maxFileSize: 5_000_000,
      visibleWhen: () => showVoucherField,
      uploadHandler: (file: File) =>
        firstValueFrom(
          imageUpload.uploadTemp(
            file,
            ImageEntityType.ORDER_ITEM_RETURN,
            'return_evidence',
          ),
        ).then((res) => res.data.imageId),
      hint: 'Foto de la guía de envío o comprobante del courier',
      cols: 4,
    },
    {
      key: 'customerVoucherAmount',
      label: 'Monto del envío (S/)',
      type: 'number-decimal',
      placeholder: '0.00',
      validators: [Validators.min(0)],
      visibleWhen: () => showVoucherField,
      min: 0,
      minFractionDigits: 2,
      hint: 'Este monto se sumará al reembolso total',
      cols: 4,
    },
    {
      key: 'notes',
      label: 'Notas adicionales',
      type: 'textarea',
      placeholder: 'Ej: Cliente confirmó envío por WhatsApp...',
      validators: [],
      cols: 4,
    },
  ];

  return [
    {
      title: 'Datos del Envío',
      fields,
    },
  ];
}
