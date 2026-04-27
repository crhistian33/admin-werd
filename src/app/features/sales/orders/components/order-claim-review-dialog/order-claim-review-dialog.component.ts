import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import {
  OrderClaim,
  ReviewClaimPayload,
  CLAIM_TYPE_LABELS,
} from '../../models/order-claim.model';

@Component({
  selector: 'app-order-claim-review-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    TextareaModule,
    SelectModule,
    TagModule,
    FormsModule,
  ],
  templateUrl: './order-claim-review-dialog.component.html',
})
export class OrderClaimReviewDialogComponent {
  protected readonly CLAIM_TYPE_LABELS = CLAIM_TYPE_LABELS;

  readonly visible = model<boolean>(false);
  readonly claim = input<OrderClaim | null>(null);
  readonly loading = input<boolean>(false);

  readonly review = output<ReviewClaimPayload>();
  readonly close = output<void>();

  protected readonly action = signal<'APPROVED' | 'REJECTED' | null>(null);
  protected readonly reviewNote = signal('');
  protected readonly internalNote = signal('');

  protected readonly actionOptions = [
    { label: 'Aprobar', value: 'APPROVED' },
    { label: 'Rechazar', value: 'REJECTED' },
  ];

  protected readonly isValid = computed(() => {
    if (!this.action()) return false;
    if (this.action() === 'REJECTED' && !this.reviewNote().trim()) return false;
    return true;
  });

  protected onConfirm(): void {
    const act = this.action();
    if (!act) return;

    this.review.emit({
      action: act,
      reviewNote: this.reviewNote() || undefined,
      internalNote: this.internalNote() || undefined,
    });
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.action.set(null);
    this.reviewNote.set('');
    this.internalNote.set('');
    this.close.emit();
  }
}
