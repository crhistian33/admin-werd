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
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import {
  OrderClaim,
  CLAIM_TYPE_LABELS,
  MarkClaimReceivedPayload,
} from '../../models';
import { TagSeverity } from '@shared/types/tag-severity.type';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { buildMarkClaimReceivedFormConfig } from '../../config/mark-claim-received-form.config';

@Component({
  selector: 'app-mark-claim-received-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    TagModule,
    FormsModule,
    FormDynamicComponent,
  ],
  templateUrl: './mark-claim-received-dialog.component.html',
})
export class MarkClaimReceivedDialogComponent {
  readonly visible = model<boolean>(false);
  readonly claim = input<OrderClaim | null>(null);
  readonly loading = input<boolean>(false);
  readonly confirm = output<MarkClaimReceivedPayload>();
  readonly close = output<void>();

  protected readonly CLAIM_TYPE_LABELS = CLAIM_TYPE_LABELS;
  protected readonly formConfig = signal(buildMarkClaimReceivedFormConfig());

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
      productCondition: formData['productCondition'],
      internalDamageNote: formData['internalDamageNote'] || undefined,
      adminNote: formData['adminNote'] || undefined,
    });
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
