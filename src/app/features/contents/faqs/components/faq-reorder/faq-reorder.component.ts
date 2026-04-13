import { Component, inject, output, signal } from '@angular/core';
import { FaqStore } from '../../store/faq.store';
import { Faq } from '../../models/faq.model';
import { LucideAngularModule } from 'lucide-angular';
import { OrderListModule } from 'primeng/orderlist';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-faq-reorder',
  imports: [LucideAngularModule, OrderListModule, TagModule, ButtonModule],
  templateUrl: './faq-reorder.component.html',
  styleUrl: './faq-reorder.component.scss',
})
export class FaqReorderComponent {
  readonly store = inject(FaqStore);

  readonly saved = output<void>();

  readonly items = signal<Faq[]>([]);
  readonly hasChanges = signal(false);

  selectedItems: Faq[] = [];

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
