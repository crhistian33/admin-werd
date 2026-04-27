import { Component, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { Order } from '../../models/order.model';
import { CurrencyPipe } from '@angular/common';
import { CancelOrderPayload } from '../../models';
import { OrderStatus } from '../../models/orders.enum';
import { TagSeverity } from '@shared/types/tag-severity.type';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { buildCancelOrderFormConfig } from '../../config/cancel-order-form.config';

interface ReasonOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-cancel-order-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    TagModule,
    FormsModule,
    CurrencyPipe,
    FormDynamicComponent,
  ],
  templateUrl: './cancel-order-dialog.component.html',
})
export class CancelOrderDialogComponent {
  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly loading = input<boolean>(false);
  readonly confirm = output<CancelOrderPayload>();
  readonly close = output<void>();

  protected readonly isOrderPaid = computed(() => {
    const o = this.order();
    return o?.status === 'paid' || o?.status === 'processing' || !!o?.paidAt;
  });

  protected readonly formConfig = computed(() => {
    const status = this.order()?.status;
    return buildCancelOrderFormConfig(status ?? 'pending_payment');
  });

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

  protected onFormSubmit(formData: Record<string, any>): void {
    const { reason, reasonDetail, adminNotes } = formData;
    const fullReason = reasonDetail ? `${reason} - ${reasonDetail}` : reason;

    this.confirm.emit({
      reason: fullReason,
      adminNotes: adminNotes || undefined,
    });
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
