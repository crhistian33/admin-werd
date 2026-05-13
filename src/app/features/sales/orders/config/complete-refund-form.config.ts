import { Validators } from '@angular/forms';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { firstValueFrom } from 'rxjs';
import { REFUND_METHOD_LABELS } from '../models/order-claim.model';

export interface RefundContext {
  isCardPayment: boolean;
  isCashOnDelivery: boolean;
  gatewayTransactionId?: string;
  totalToRefund: number;
  refundMethod?: string;
  refundAccountDetails?: string;
  items?: string;
}

export function buildCompleteRefundFormConfig(
  imageUpload: ImageUploadService,
  context: RefundContext,
): FormStepConfig[] {
  const {
    isCardPayment,
    gatewayTransactionId,
    refundMethod,
    refundAccountDetails,
    items,
  } = context;

  const fields: FormStepConfig['fields'] = [
    {
      key: 'info',
      label: 'Productos devueltos',
      type: 'info',
      defaultValue: items,
      disabled: true,
      cols: 4,
    },
    {
      key: 'refundMethod',
      label: 'Método de reembolso',
      type: 'select',
      validators: [Validators.required],
      options: [
        {
          label: REFUND_METHOD_LABELS[refundMethod || 'STORE_CREDIT'],
          value: refundMethod || 'STORE_CREDIT',
        },
      ],
      defaultValue: refundMethod || 'STORE_CREDIT',
      hint: 'Método definido en el envío de retorno',
      disabled: true,
      cols: 4,
    },
    {
      key: 'reason',
      label: 'Datos para el reembolso',
      type: 'textarea',
      placeholder: 'Datos de cuenta...',
      validators: [],
      defaultValue: refundAccountDetails,
      visibleWhen: () => !!refundAccountDetails,
      hint: 'Datos proporcionados por el cliente',
      disabled: true,
      cols: 4,
    },
    {
      key: 'gatewayRefundId',
      label: 'ID de extorno en Culqi',
      type: 'text',
      placeholder: 'Ej: ref_abc123xyz',
      validators: [Validators.required],
      visibleWhen: () => isCardPayment,
      hint: `Transacción original: ${gatewayTransactionId}`,
      cols: 4,
    },
    {
      key: 'tempImageIds',
      label: 'Comprobante de reembolso',
      type: 'file-image',
      accept: 'image/*',
      maxFileSize: 5_000_000,
      visibleWhen: () => refundMethod !== 'STORE_CREDIT',
      uploadHandler: (file: File) =>
        firstValueFrom(
          imageUpload.uploadTemp(
            file,
            ImageEntityType.ORDER_REFUND,
            'refund_evidence',
          ),
        ).then((res) => res.data.imageId),
      hint: 'Captura del comprobante (transferencia, voucher, extorno)',
      cols: 4,
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

  return [{ title: 'Procesar Reembolso', fields }];
}
