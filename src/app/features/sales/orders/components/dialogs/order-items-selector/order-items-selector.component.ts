import { Component, computed, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrderItem } from '../../../models/order.model';
import { environment } from '@env/environment';

export interface SelectedOrderItem {
  orderItemId: string;
  quantity: number;
}

import { OrderClaim } from '../../../models/order-claim.model';
import * as U from '../../../utils/order-calculations.utils';

@Component({
  selector: 'app-order-items-selector',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    InputNumberModule,
  ],
  templateUrl: './order-items-selector.component.html',
})
export class OrderItemsSelectorComponent {
  readonly items = input.required<OrderItem[]>();
  readonly claims = input<OrderClaim[]>([]); // ✅ Agregar input de claims
  readonly selection = model<SelectedOrderItem[]>([]);
  readonly loading = input<boolean>(false);

  /**
   * Calcula la cantidad disponible para reclamar de cada ítem.
   */
  protected readonly itemsWithAvailability = computed(() => {
    const claims = this.claims();
    return this.items().map((item) => {
      // ✅ Usamos la utilidad centralizada para obtener lo ya reclamado (evita conteo doble)
      const claimedQty = U.getClaimedQuantity(claims, item.id);
      const available = Math.max(0, item.quantity - claimedQty);

      return {
        ...item,
        availableQuantity: available,
      };
    });
  });

  public getProductImageUrl(url?: string): string {
    if (!url) return 'assets/images/placeholder.png';
    return url.startsWith('http') ? url : `${environment.apiImagesUrl}${url}`;
  }

  protected isSelected(itemId: string): boolean {
    return this.selection().some((s) => s.orderItemId === itemId);
  }

  protected toggleSelection(
    item: OrderItem & { availableQuantity: number },
  ): void {
    const current = this.selection();
    const index = current.findIndex((s) => s.orderItemId === item.id);

    if (index === -1) {
      // Agregar inicializando en 1 (el usuario subirá si necesita más)
      this.selection.set([
        ...current,
        { orderItemId: item.id, quantity: 1 },
      ]);
    } else {
      // Quitar
      this.selection.set(current.filter((s) => s.orderItemId !== item.id));
    }
  }

  protected updateQuantity(itemId: string, quantity: number): void {
    const current = this.selection();
    const index = current.findIndex((s) => s.orderItemId === itemId);

    if (index !== -1) {
      const updated = [...current];
      updated[index] = { ...updated[index], quantity };
      this.selection.set(updated);
    }
  }

  protected getSelectedQuantity(itemId: string): number {
    return (
      this.selection().find((s) => s.orderItemId === itemId)?.quantity ?? 0
    );
  }
}
