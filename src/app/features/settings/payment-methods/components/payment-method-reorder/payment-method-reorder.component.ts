import { Component, inject, output, signal } from '@angular/core';
import { PaymentMethodStore } from '../../store/payment-method.store';
import { PaymentMethod } from '../../models/payment-method.model';
import { OrderListModule } from 'primeng/orderlist';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-payment-method-reorder',
  imports: [OrderListModule, ButtonModule, TagModule],
  templateUrl: './payment-method-reorder.component.html',
  styleUrl: './payment-method-reorder.component.scss',
})
export class PaymentMethodReorderComponent {
  readonly store = inject(PaymentMethodStore);

  readonly saved = output<void>();

  readonly items = signal<PaymentMethod[]>([]);
  readonly hasChanges = signal(false);

  selectedItems: PaymentMethod[] = [];

  ngOnInit(): void {
    const sorted = [...this.store.data()].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    this.items.set(sorted);
  }

  onReorder(event: any): void {
    const reordered = [...this.items()];
    const moved = reordered.splice(event.dragIndex, 1)[0];
    reordered.splice(event.dropIndex, 0, moved);

    this.items.set(reordered);
    this.hasChanges.set(true);
    this.selectedItems = [];
  }

  saveOrder(): void {
    const ids = this.items().map((s) => s.id);
    this.store.reorder(ids, () => {
      this.hasChanges.set(false);
      this.saved.emit();
    });
  }

  onCancel(): void {
    this.saved.emit();
  }
}
