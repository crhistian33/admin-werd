import {
  Component,
  computed,
  inject,
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
import { TagModule } from 'primeng/tag';
import {
  OrderClaim,
  CLAIM_TYPE_LABELS,
  CompleteRefundPayload,
  OrderRefund,
} from '../../models';
import { TagSeverity } from '@shared/types/tag-severity.type';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { buildCompleteRefundFormConfig } from '../../config/complete-refund-form.config';
import { ImageUploadService } from '@shared/images/services/image-upload.service';

@Component({
  selector: 'app-complete-refund-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    TagModule,
    FormsModule,
    CurrencyPipe,
    FormDynamicComponent,
  ],
  templateUrl: './complete-refund-dialog.component.html',
})
export class CompleteRefundDialogComponent {
  private readonly imageUpload = inject(ImageUploadService);

  readonly visible = model<boolean>(false);
  readonly claim = input<OrderClaim | null>(null);
  readonly refund = input<OrderRefund | null>(null);
  readonly loading = input<boolean>(false);
  readonly confirm = output<CompleteRefundPayload>();
  readonly close = output<void>();

  // ✅ Inputs adicionales del componente padre
  readonly isCardPaymentInput = input<boolean>(false);
  readonly originalPaymentMethodInput = input<string | null>(null);

  protected readonly CLAIM_TYPE_LABELS = CLAIM_TYPE_LABELS;

  // ✅ Determinar si el pedido fue pagado con tarjeta
  // Esto debería venir del Order padre, no del Refund
  protected readonly isCardPayment = signal(false);

  // ✅ Método de pago original (para mostrar en el diálogo)
  protected readonly originalPaymentMethod = signal<string | null>(null);

  protected readonly isFromClaim = computed(() => !!this.claim());

  protected readonly formConfig = computed(() => {
    return buildCompleteRefundFormConfig(
      this.imageUpload,
      this.isCardPayment(),
    );
  });

  // ✅ Método para configurar el contexto del diálogo
  configureContext(isCard: boolean, paymentMethodName?: string): void {
    this.isCardPayment.set(isCard);
    this.originalPaymentMethod.set(paymentMethodName ?? null);
  }

  protected calculateClaimRefundAmount(): number {
    const c = this.claim();
    if (!c?.items) return 0;
    const itemsTotal = c.items.reduce(
      (sum, item) => sum + (item.orderItem?.unitPrice ?? 0) * item.quantity,
      0,
    );
    return itemsTotal + (c.customerVoucherAmount ?? 0);
  }

  protected getClaimTypeSeverity(type: string): TagSeverity {
    const map: Record<string, TagSeverity> = {
      CANCELLATION: 'danger',
      REFUND: 'warn',
      REPLACEMENT: 'info',
    };
    return map[type] ?? 'secondary';
  }

  protected onFormSubmit(formData: Record<string, any>): void {
    this.confirm.emit({
      refundMethod: formData['refundMethod'],
      gatewayRefundId: formData['gatewayRefundId'] || undefined,
      adminNotes: formData['adminNotes'] || undefined,
      tempImageIds: formData['tempImageIds']
        ? [formData['tempImageIds']].flat()
        : undefined, // ✅ Enviar imágenes
    });
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
