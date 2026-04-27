import {
  Component,
  input,
  output,
  model,
  signal,
  inject,
  effect,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { Order } from '../../models/order.model';
import { UpdateLogisticsPayload } from '../../models';
import { buildLogisticsFormConfig } from '../../config/order-logistic-form.config';
import { DeliveryType } from '../../models/orders.enum';

@Component({
  selector: 'app-order-logistics-dialog',
  standalone: true,
  imports: [DialogModule, FormDynamicComponent],
  templateUrl: './order-logistics-dialog.component.html',
})
export class OrderLogisticsDialogComponent {
  private readonly imageUpload = inject(ImageUploadService);

  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly loading = input<boolean>(false);

  readonly save = output<UpdateLogisticsPayload>();
  readonly close = output<void>();

  // Configuración del formulario
  protected readonly formConfig = signal(
    buildLogisticsFormConfig(this.imageUpload),
  );

  // Datos iniciales para el formulario (se actualizan cuando cambia el pedido)
  protected readonly initialData = signal<Record<string, any> | null>(null);

  constructor() {
    effect(() => {
      const order = this.order();
      const logistics = order?.logistics;

      if (logistics) {
        this.initialData.set({
          deliveryType: logistics.deliveryType,
          courierName: logistics.courierName,
          trackingNumber: logistics.trackingNumber,
          actualShippingCost: logistics.actualShippingCost,
          internalTransportCost: logistics.internalTransportCost,
          notes: logistics.notes,
          // Para el campo file-image, el FormDynamicComponent espera
          // _currentImageUrl_tempImageIds para mostrar el preview
          _currentImageUrl_tempImageIds:
            logistics.deliveryPhotoUrl || logistics.packingPhotoUrl,
        });
      } else {
        this.initialData.set(null);
      }
    });
  }

  protected onFormSubmit(formData: Record<string, any>): void {
    const payload: UpdateLogisticsPayload = {
      deliveryType: formData['deliveryType'] as DeliveryType,
      courierName: formData['courierName'] || undefined,
      trackingNumber: formData['trackingNumber'] || undefined,
      actualShippingCost: formData['actualShippingCost'] ?? undefined,
      internalTransportCost: formData['internalTransportCost'] ?? undefined,
      tempImageIds: formData['tempImageIds']
        ? [formData['tempImageIds']].flat()
        : undefined,
    };

    this.save.emit(payload);
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
