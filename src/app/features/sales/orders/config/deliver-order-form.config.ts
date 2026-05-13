import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { ImageEntityType } from '@shared/images/models/image-entity-type.enum';
import { firstValueFrom } from 'rxjs';

export function buildDeliverOrderFormConfig(
  imageUpload: ImageUploadService,
  isCashOnDelivery: boolean,
  totalAmount: number = 0,
): FormStepConfig[] {
  const fields: FormStepConfig['fields'] = [
    {
      key: 'cashCollectedAmount',
      label: 'Monto cobrado al cliente',
      type: 'number-decimal',
      placeholder: '0.00',
      validators: [Validators.required, Validators.min(0)],
      min: 0,
      minFractionDigits: 2,
      defaultValue: totalAmount,
      hint: 'Total del pedido que se cobró al cliente',
      visibleWhen: () => isCashOnDelivery,
      cols: 4,
    },
    {
      key: 'deliveryEvidenceNote',
      label: 'Nota de entrega',
      type: 'textarea',
      placeholder:
        'Ej: Entregado en perfecto estado, recibido por el cliente...',
      validators: [],
      cols: 4,
    },
    {
      key: 'tempImageIds',
      label: 'Evidencia de entrega',
      type: 'file-gallery',
      accept: 'image/*',
      maxFileSize: 5_000_000,
      uploadHandler: (file: File) =>
        firstValueFrom(
          imageUpload.uploadTemp(
            file,
            ImageEntityType.ORDER_DELIVERY,
            'delivery_evidence',
          ),
        ).then((res) => res.data.imageId),
      hint: 'Foto del paquete entregado, firma o cliente recibiendo',
      cols: 4,
    },
  ];

  return [
    {
      title: 'Confirmar Entrega',
      fields,
    },
  ];
}
