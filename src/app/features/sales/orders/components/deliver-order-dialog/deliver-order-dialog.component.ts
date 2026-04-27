import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { Order } from '../../models/order.model';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { LucideAngularModule } from 'lucide-angular';
import { DeliverOrderPayload } from '../../models';
import { OrderStatus } from '../../models/orders.enum';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { buildDeliverOrderFormConfig } from '../../config/deliver-order-form.config';

type TagSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';

@Component({
  selector: 'app-deliver-order-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputNumberModule,
    TextareaModule,
    TagModule,
    FileUploadModule,
    FormsModule,
    CurrencyPipe,
    LucideAngularModule,
    FormDynamicComponent,
  ],
  templateUrl: './deliver-order-dialog.component.html',
})
export class DeliverOrderDialogComponent {
  private readonly imageUpload = inject(ImageUploadService);

  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly loading = input<boolean>(false);
  readonly confirm = output<DeliverOrderPayload>();
  readonly close = output<void>();

  protected readonly isCashOnDelivery = computed(() => {
    return this.order()?.paymentMethod?.code === 'cash_on_delivery';
  });

  protected readonly formConfig = computed(() => {
    return buildDeliverOrderFormConfig(
      this.imageUpload,
      this.isCashOnDelivery(),
    );
  });

  protected getCustomerName(order: Order): string {
    if (order.customer)
      return `${order.customer.firstName} ${order.customer.lastName}`;
    return order.guestName ?? order.guestEmail ?? 'Guest';
  }

  protected getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      pending_payment: 'Pendiente de pago',
      paid: 'Pagado',
      processing: 'En proceso',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
    };
    return labels[status] ?? status;
  }

  protected getStatusSeverity(status: OrderStatus): TagSeverity {
    const map: Record<OrderStatus, TagSeverity> = {
      pending_payment: 'warn',
      paid: 'success',
      processing: 'info',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'contrast',
    };
    return map[status] ?? 'secondary';
  }

  protected getDeliveryTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      COURIER: 'Courier / Agencia',
      LOCAL_MOTORIZED: 'Motorizado Local',
    };
    return labels[type] ?? type;
  }

  protected onFormSubmit(formData: Record<string, any>): void {
    const payload: DeliverOrderPayload = {
      deliveryEvidenceNote: formData['deliveryEvidenceNote'] || undefined,
      cashCollectedAmount: this.isCashOnDelivery()
        ? formData['cashCollectedAmount']
        : undefined,
      tempImageIds: formData['tempImageIds']
        ? [formData['tempImageIds']].flat()
        : undefined,
    };
    this.confirm.emit(payload);
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
