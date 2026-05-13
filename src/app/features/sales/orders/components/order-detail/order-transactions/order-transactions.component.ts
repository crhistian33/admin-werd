import { Component, input, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { OrderPaymentTransaction } from '../../../models/order.model';
import { OrderStore } from '../../../store/order.store';

@Component({
  selector: 'app-order-transactions',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TableModule, TagModule],
  templateUrl: './order-transactions.component.html',
})
export class OrderTransactionsComponent {
  readonly transactions = input.required<OrderPaymentTransaction[]>();
  readonly store = inject(OrderStore);

  /** Total pagado (suma de transacciones completadas) */
  protected totalPaid(): number {
    return this.transactions()
      .filter((tx) => tx.status === 'completed')
      .reduce((sum, tx) => sum + (tx.paidAmount || tx.amount), 0);
  }

  /** Neto real: pagado - reembolsado - ajustes (lo que el negocio realmente debe retener) */
  protected netFinal(): number {
    return this.totalPaid() - this.store.totalRefunded();
  }

  /** Balance: netoFinal - adjustedGrandTotal */
  protected balance(): number {
    return this.netFinal() - this.store.adjustedGrandTotal();
  }

  /** Diferencia entre el total original y el ajustado después de devoluciones */
  protected adjustedGrandTotalDiff(): number {
    const order = this.store.currentOrder();
    if (!order) return 0;
    return Number(order.total) - this.store.adjustedGrandTotal();
  }
}
