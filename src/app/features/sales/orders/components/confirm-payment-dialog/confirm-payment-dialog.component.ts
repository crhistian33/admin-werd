import { Component, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { Order } from '../../models/order.model';
import { ConfirmPaymentPayload } from '../../models';
import { CurrencyPipe } from '@angular/common';
import { OrderStatus } from '../../models/orders.enum';
import { TagSeverity } from '@shared/types/tag-severity.type';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { buildConfirmPaymentFormConfig } from '../../config/confirm-payment-form.config';

@Component({
  selector: 'app-confirm-payment-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    TagModule,
    FormsModule,
    CurrencyPipe,
    FormDynamicComponent,
  ],
  templateUrl: './confirm-payment-dialog.component.html',
})
export class ConfirmPaymentDialogComponent {
  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly loading = input<boolean>(false);
  readonly confirm = output<ConfirmPaymentPayload>();
  readonly close = output<void>();

  protected readonly formConfig = signal(buildConfirmPaymentFormConfig());

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

  protected onFormSubmit(formData: Record<string, any>): void {
    this.confirm.emit({
      operationNumber: formData['operationNumber'],
      paidAmount: formData['paidAmount'],
      adminNotes: formData['adminNotes'] || undefined,
    });
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
