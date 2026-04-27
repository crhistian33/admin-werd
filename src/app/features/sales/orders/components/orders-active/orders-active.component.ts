// src/app/features/sales/orders/components/orders-active/orders-active.component.ts

import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { ConfirmPaymentDialogComponent } from '../confirm-payment-dialog/confirm-payment-dialog.component';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';

import { OrderStore } from '../../store/order.store';
import { Order } from '../../models/order.model';
import { orderFilterDefaults } from '../../models/order-filter.model';
import { orderTableConfig } from '../../config/order-table.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { CancelOrderPayload, ConfirmPaymentPayload } from '../../models';

@Component({
  selector: 'app-orders-active',
  standalone: true,
  imports: [
    DataTableComponent,
    FilterDynamicComponent,
    ConfirmPaymentDialogComponent,
    CancelOrderDialogComponent,
  ],
  templateUrl: './orders-active.component.html',
})
export class OrdersActiveComponent {
  readonly router = inject(Router);
  readonly store = inject(OrderStore);

  // ─────────────────────────────────────────────────────────────
  // ESTADOS DE DIÁLOGOS
  // ─────────────────────────────────────────────────────────────

  protected readonly confirmPaymentDialogVisible = signal(false);
  protected readonly cancelOrderDialogVisible = signal(false);
  protected readonly selectedOrder = signal<Order | null>(null);
  protected readonly drawerVisible = signal(false);

  // ─────────────────────────────────────────────────────────────
  // CONFIGURACIÓN DE TABLA
  // ─────────────────────────────────────────────────────────────

  readonly tableConfig = orderTableConfig(this.router, {
    onStatusChange: (order) => {
      this.selectedOrder.set(order);
      this.openAppropriateDialog(order);
    },
    getActionTooltip: (order) => {
      const isManualPayment =
        order.paymentMethod?.type === 'wallet' ||
        order.paymentMethod?.type === 'cash_code';

      switch (order.status) {
        case 'pending_payment':
          return isManualPayment ? 'Confirmar pago' : 'Cancelar pedido';
        case 'paid':
        case 'processing':
          return 'Cancelar pedido';
        default:
          return 'Cambiar estado';
      }
    },
  });

  // ─────────────────────────────────────────────────────────────
  // LÓGICA DE APERTURA DE DIÁLOGO CORRECTO
  // ─────────────────────────────────────────────────────────────

  private openAppropriateDialog(order: Order): void {
    const isManualPayment =
      order.paymentMethod?.type === 'wallet' ||
      order.paymentMethod?.type === 'cash_code';

    switch (order.status) {
      case 'pending_payment':
        if (isManualPayment) {
          // YAPE/PLIN/Transferencia → Confirmar pago
          this.confirmPaymentDialogVisible.set(true);
        } else {
          // Tarjeta → Cancelar pedido (el pago es automático, no se confirma manualmente)
          this.cancelOrderDialogVisible.set(true);
        }
        break;

      case 'paid':
      case 'processing':
        // En estos estados, el botón "Cambiar estado" abre Cancelar
        // (Preparar y Enviar se hacen desde el detalle)
        this.cancelOrderDialogVisible.set(true);
        break;

      case 'shipped':
      case 'delivered':
      case 'cancelled':
      case 'refunded':
        // En estos estados, el botón "Cambiar estado" NO debería aparecer
        // (ya está controlado por el `disabled` en la config de la tabla)
        // Pero si por alguna razón llega aquí, navegar al detalle
        this.router.navigate(['/ventas/pedidos', order.id]);
        break;

      default:
        this.router.navigate(['/ventas/pedidos', order.id]);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // CONFIGURACIÓN DE FILTROS
  // ─────────────────────────────────────────────────────────────

  readonly filterFields = computed<FilterFieldConfig[]>(() =>
    this.tableConfig.columns
      .filter((col) => col.filter?.enabled)
      .map((col) => ({
        key: (col.filterField ?? col.field) as string,
        label: col.header,
        type: col.filter!.type,
        options: col.filter!.options,
        placeholder: `Filtrar por ${col.header.toLowerCase()}`,
      })),
  );

  // ─────────────────────────────────────────────────────────────
  // PAGINACIÓN
  // ─────────────────────────────────────────────────────────────

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  // ─────────────────────────────────────────────────────────────
  // HANDLERS DE TABLA
  // ─────────────────────────────────────────────────────────────

  handlePagination(event: { first: number; rows: number }): void {
    this.store.setFilter({
      page: Math.floor(event.first / event.rows) + 1,
      limit: event.rows,
    } as any);
  }

  handleSearch(query: string): void {
    this.store.setFilter({ search: query, page: 1 } as any);
  }

  handleClearFilters(): void {
    this.store.setFilter(orderFilterDefaults());
  }

  // ─────────────────────────────────────────────────────────────
  // HANDLERS DE DIÁLOGOS
  // ─────────────────────────────────────────────────────────────

  protected onConfirmPayment(payload: ConfirmPaymentPayload): void {
    const order = this.selectedOrder();
    if (!order) return;

    this.store.confirmPayment(order.id as string, payload, () => {
      this.confirmPaymentDialogVisible.set(false);
      this.selectedOrder.set(null);
    });
  }

  protected onCancelOrder(payload: CancelOrderPayload): void {
    const order = this.selectedOrder();
    if (!order) return;

    this.store.cancelOrder(order.id as string, payload, () => {
      this.cancelOrderDialogVisible.set(false);
      this.selectedOrder.set(null);
    });
  }
}
