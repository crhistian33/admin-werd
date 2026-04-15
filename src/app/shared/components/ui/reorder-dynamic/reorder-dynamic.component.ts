import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListModule } from 'primeng/orderlist';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { LucideAngularModule } from 'lucide-angular';
import { ReorderService } from '@shared/services/ui/reorder.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-reorder-dynamic',
  standalone: true,
  imports: [
    CommonModule,
    OrderListModule,
    ButtonModule,
    TagModule,
    LucideAngularModule,
  ],
  templateUrl: './reorder-dynamic.component.html',
  styleUrl: './reorder-dynamic.component.scss',
})
export class ReorderDynamicComponent {
  readonly reorderService = inject(ReorderService);
  private readonly apiImagesUrl = environment.apiImagesUrl;

  readonly items = signal<any[]>([]);
  readonly hasChanges = signal(false);

  selectedItems: any[] = [];

  constructor() {
    effect(() => {
      const config = this.reorderService.config();
      if (config) {
        this.items.set([...config.items]);
        this.hasChanges.set(false);
      }
    });
  }

  onReorder(event: any): void {
    this.hasChanges.set(true);
  }

  saveOrder(): void {
    const config = this.reorderService.config();
    if (config) {
      const ids = this.items().map((item: any) => item.id);
      config.onSave(ids);
    }
  }

  onCancel(): void {
    this.reorderService.close();
  }

  buildImageUrl(path: string | undefined): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${this.apiImagesUrl}${path}`;
  }

  getValue(item: any, field: string | ((item: any) => any)): any {
    if (typeof field === 'function') {
      return field(item);
    }
    return item[field];
  }
}
