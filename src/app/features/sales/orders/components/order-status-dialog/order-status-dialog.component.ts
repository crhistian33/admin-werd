import {
  Component,
  computed,
  input,
  output,
  model,
  signal,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';

import { Order, VALID_TRANSITIONS, ORDER_STATUS_LABELS } from '../../models';
import type { UpdateOrderStatusPayload } from '../../models';
import { OrderStatus } from '../../models/orders.enum';

interface StatusOption {
  label: string;
  value: OrderStatus;
}

@Component({
  selector: 'app-order-status-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    TagModule,
    FormsModule,
  ],
  templateUrl: './order-status-dialog.component.html',
})
export class OrderStatusDialogComponent implements OnChanges {
  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly loading = input<boolean>(false);

  readonly statusChange = output<UpdateOrderStatusPayload>();
  readonly close = output<void>();

  // Expuesto al template
  readonly ORDER_STATUS_LABELS = ORDER_STATUS_LABELS;

  // Placeholder del comentario según el estado destino seleccionado
  readonly STATUS_COMMENT_PLACEHOLDER: Partial<Record<OrderStatus, string>> = {
    paid: 'Ej: Pago confirmado manualmente, referencia #...',
    processing: 'Ej: Pedido en preparación en almacén Lima',
    shipped: 'Ej: Enviado por Olva Courier, tracking #ABC123',
    delivered: 'Ej: Entregado y recibido por el cliente',
    cancelled: 'Ej: Cliente solicitó cancelación antes del envío',
    refunded: 'Ej: Reembolso procesado vía transferencia bancaria',
  };

  readonly commentPlaceholder = computed(() => {
    const s = this.selectedStatus();
    return (
      (s && this.STATUS_COMMENT_PLACEHOLDER[s]) ??
      'Comentario que quedará registrado en el historial del pedido'
    );
  });

  // Form state
  readonly selectedStatus = signal<OrderStatus | null>(null);
  readonly adminNotes = signal('');
  readonly statusComment = signal('');

  // Opciones de estado disponibles para el pedido actual
  readonly statusOptions = computed<StatusOption[]>(() => {
    const order = this.order();
    if (!order) return [];
    return VALID_TRANSITIONS[order.status].map((s) => ({
      label: ORDER_STATUS_LABELS[s],
      value: s,
    }));
  });

  readonly hasTransitions = computed(() => this.statusOptions().length > 0);

  // Resetea el form cuando cambia el pedido
  ngOnChanges(): void {
    this.selectedStatus.set(null);
    this.adminNotes.set(this.order()?.adminNotes ?? '');
    this.statusComment.set('');
  }

  onConfirm(): void {
    const status = this.selectedStatus();
    if (!status && !this.adminNotes()) return;

    this.statusChange.emit({
      ...(status && { status }),
      adminNotes: this.adminNotes() || undefined,
      statusComment: this.statusComment() || undefined,
    });
  }

  onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }

  // Helper para el tag del estado actual
  statusSeverity(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
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
}
