import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import {
  OrderClaim,
  CLAIM_TYPE_LABELS,
  ConfirmReturnShipmentPayload,
} from '../../../models';
import { buildConfirmReturnShipmentFormConfig } from '../../../config/confirm-return-shipment-form.config';
import { TagSeverity } from '@shared/types/severity.type';

@Component({
  selector: 'app-confirm-return-shipment-dialog',
  standalone: true,
  imports: [DialogModule, TagModule, FormDynamicComponent],
  templateUrl: './confirm-return-shipment-dialog.component.html',
})
export class ConfirmReturnShipmentDialogComponent {
  private readonly imageUpload = inject(ImageUploadService);

  readonly visible = model<boolean>(false);
  readonly claim = input<OrderClaim | null>(null);
  readonly loading = input<boolean>(false);
  readonly confirm = output<ConfirmReturnShipmentPayload>();
  readonly close = output<void>();

  protected readonly CLAIM_TYPE_LABELS = CLAIM_TYPE_LABELS;

  protected readonly showVoucherField = computed(() => {
    const c = this.claim();
    return (
      c?.reasonCategory === 'STORE_ERROR' ||
      c?.reasonCategory === 'PRODUCT_FAULT'
    );
  });

  protected readonly formConfig = computed(() => {
    return buildConfirmReturnShipmentFormConfig(
      this.imageUpload,
      this.showVoucherField(),
    );
  });

  protected getClaimTypeSeverity(type: string): TagSeverity {
    const map: Record<string, TagSeverity> = {
      CANCELLATION: 'danger',
      REFUND: 'warn',
      REPLACEMENT: 'info',
    };
    return map[type] ?? 'secondary';
  }

  protected onFormSubmit(formData: Record<string, any>): void {
    console.log('Formdata', formData);
    this.confirm.emit({
      courierName: formData['courierName'],
      trackingNumber: formData['trackingNumber'],
      customerVoucherAmount: this.showVoucherField()
        ? (formData['customerVoucherAmount'] ?? undefined)
        : undefined,
      tempImageIds: formData['tempImageIds']
        ? [formData['tempImageIds']].flat()
        : undefined,
      notes: formData['notes'] || undefined,
    });
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
