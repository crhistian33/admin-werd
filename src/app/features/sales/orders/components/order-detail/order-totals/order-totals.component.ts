import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Order } from '../../../models/order.model';
import * as OrderUtils from '../../../utils/order-calculations.utils';

@Component({
  selector: 'app-order-totals',
  imports: [CurrencyPipe],
  templateUrl: './order-totals.component.html',
})
export class OrderTotalsComponent {
  readonly order = input.required<Order>();
  readonly totalRefunded = input.required<number>();
  readonly adjustedTotal = input.required<number>();

  /**
   * Calcula el total de ajustes por cancelaciones y devoluciones
   * (NO incluye reemplazos)
   */
  protected getAdjustmentsTotal(): number {
    const items = this.order().items ?? [];
    const claims = this.order().claims ?? [];

    return items.reduce((total, item) => {
      const originalTotal = Number(item.lineTotal);
      const effectiveTotal = OrderUtils.getEffectiveLineTotal(claims, item);
      return total + (originalTotal - effectiveTotal);
    }, 0);
  }

  /**
   * Calcula el total ajustado (original - ajustes)
   */
  protected getAdjustedTotal(): number {
    const adjustments = this.getAdjustmentsTotal();
    return Number(this.order().total) - adjustments;
  }
}
