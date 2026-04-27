import { Component, input, output, model, signal, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { Order } from '../../models/order.model';
import { CreateClaimPayload } from '../../models';
import { buildClaimFormConfig } from '../../config/order-claim-form.config';
import { ClaimType, ReasonCategory } from '../../models/orders.enum';

@Component({
  selector: 'app-order-claim-dialog',
  standalone: true,
  imports: [DialogModule, FormDynamicComponent],
  templateUrl: './order-claim-dialog.component.html',
})
export class OrderClaimDialogComponent {
  private readonly imageUpload = inject(ImageUploadService);

  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly loading = input<boolean>(false);

  readonly save = output<CreateClaimPayload>();
  readonly close = output<void>();

  // Configuración del formulario (se genera una vez)
  protected readonly formConfig = signal(
    buildClaimFormConfig(this.imageUpload),
  );

  protected onFormSubmit(formData: Record<string, any>): void {
    const payload: CreateClaimPayload = {
      type: formData['type'] as ClaimType,
      reasonCategory: formData['reasonCategory'] as ReasonCategory,
      description: formData['description'] || undefined,
      customerVoucherAmount: formData['customerVoucherAmount'] || undefined,
      tempImageIds: formData['tempImageIds']?.length
        ? formData['tempImageIds']
        : undefined,
      adminNotes: formData['adminNotes'] || undefined,
    };

    this.save.emit(payload);
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
