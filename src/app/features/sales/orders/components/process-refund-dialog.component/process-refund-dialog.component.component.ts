import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Order } from '../../models/order.model';
import { OrderRefund } from '../../models/order.model';
import { CompleteRefundPayload } from '../../models';

@Component({
  selector: 'app-process-refund-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    FormsModule,
    CurrencyPipe,
  ],
  templateUrl: './process-refund-dialog.component.component.html',
})
export class ProcessRefundDialogComponent {
  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly refund = input<OrderRefund | null>(null);
  readonly loading = input<boolean>(false);

  readonly confirm = output<CompleteRefundPayload>();
  readonly close = output<void>();

  protected readonly refundMethod = signal<
    'ORIGINAL_PAYMENT_METHOD' | 'STORE_CREDIT' | 'BANK_TRANSFER' | null
  >(null);
  protected readonly gatewayRefundId = signal('');
  protected readonly adminNotes = signal('');

  protected readonly methodOptions = [
    { label: '💰 Método de pago original', value: 'ORIGINAL_PAYMENT_METHOD' },
    { label: '🎁 Crédito en tienda', value: 'STORE_CREDIT' },
    { label: '🏦 Transferencia bancaria', value: 'BANK_TRANSFER' },
  ];

  protected readonly isValid = computed(() => !!this.refundMethod());

  protected onConfirm(): void {
    if (!this.isValid()) return;

    this.confirm.emit({
      refundMethod: this.refundMethod()!,
      gatewayRefundId: this.gatewayRefundId() || undefined,
      adminNotes: this.adminNotes() || undefined,
    });
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.refundMethod.set(null);
    this.gatewayRefundId.set('');
    this.adminNotes.set('');
    this.close.emit();
  }
}
