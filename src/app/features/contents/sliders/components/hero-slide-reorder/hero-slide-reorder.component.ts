import { Component, inject, output, signal } from '@angular/core';
import { OrderListModule } from 'primeng/orderlist';
import { HeroSlideStore } from '../../store/hero-slide.store';
import { environment } from '@env/environment';
import { HeroSlide } from '../../models/hero-slide.model';
import { LucideAngularModule } from 'lucide-angular';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero-slide-reorder',
  imports: [OrderListModule, LucideAngularModule, TagModule, ButtonModule],
  templateUrl: './hero-slide-reorder.component.html',
  styleUrl: './hero-slide-reorder.component.scss',
})
export class HeroSlideReorderComponent {
  readonly store = inject(HeroSlideStore);
  private readonly apiImagesUrl = environment.apiImagesUrl;

  readonly saved = output<void>();

  readonly items = signal<HeroSlide[]>([]);
  readonly hasChanges = signal(false);

  selectedItems: HeroSlide[] = [];

  ngOnInit(): void {
    const sorted = [...this.store.data()].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    console.log('sorted', sorted);
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

  buildImageUrl(path: string): string {
    return path.startsWith('http') ? path : `${this.apiImagesUrl}${path}`;
  }
}
