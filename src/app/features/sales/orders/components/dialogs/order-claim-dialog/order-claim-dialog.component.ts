import {
  Component,
  input,
  output,
  model,
  signal,
  computed,
  inject,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { Order } from '../../../models/order.model';
import { CreateClaimPayload } from '../../../models';
import { buildClaimFormConfig } from '../../../config/order-claim-form.config';
import {
  OrderItemsSelectorComponent,
  SelectedOrderItem,
} from '../order-items-selector/order-items-selector.component';

@Component({
  selector: 'app-order-claim-dialog',
  standalone: true,
  imports: [DialogModule, FormDynamicComponent, OrderItemsSelectorComponent],
  templateUrl: './order-claim-dialog.component.html',
})
export class OrderClaimDialogComponent {
  private readonly imageUpload = inject(ImageUploadService);

  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly loading = input<boolean>(false);

  readonly save = output<CreateClaimPayload>();
  readonly close = output<void>();

  // Ítems seleccionados
  protected readonly selectedItems = signal<SelectedOrderItem[]>([]);

  // Configuración del formulario (se hace reactiva al estado del pedido)
  protected readonly formConfig = computed(() =>
    buildClaimFormConfig(this.imageUpload, this.order()?.status),
  );

  protected onFormSubmit(formData: Record<string, any>): void {
    const payload: CreateClaimPayload = {
      type: formData['type'],
      reasonCategory: formData['reasonCategory'],
      description: formData['description'],
      customerVoucherAmount: formData['customerVoucherAmount'],
      tempImageIds: formData['tempImageIds'],
      items: this.selectedItems(), // ✅ Usar selección manual
      autoApprove: formData['autoApprove'],
    };

    this.save.emit(payload);
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.selectedItems.set([]); // Reset
    this.close.emit();
  }
}
