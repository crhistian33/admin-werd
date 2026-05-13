import { Component, input, model, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { DialogDynamicConfig } from '@shared/types/dialog-dynamic.type';
import { OrderClaim } from '../../../models';

@Component({
  selector: 'app-order-actions-dialog',
  standalone: true,
  imports: [DialogModule, FormDynamicComponent, SkeletonModule, TagModule],
  templateUrl: './order-actions-dialog.component.html',
  styleUrl: './order-actions-dialog.component.scss',
})
export class OrderActionsDialogComponent {
  readonly visible = model<boolean>(false);
  readonly config = input<DialogDynamicConfig | null>(null);
  readonly loading = input<boolean>(false);
  readonly action = output<Record<string, any>>();
  readonly close = output<void>();
  readonly claims = input<OrderClaim[]>([]);

  protected onFormSubmit(formData: Record<string, any>): void {
    const { _removedImageIds, ...rest } = formData;
    this.action.emit(rest);
  }

  protected onCancel(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
