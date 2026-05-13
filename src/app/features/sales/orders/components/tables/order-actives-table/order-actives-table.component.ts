import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { OrderActionsDialogComponent } from '../../dialogs/order-actions-dialog/order-actions-dialog.component';

import { OrderStore } from '../../../store/order.store';
import { Order } from '../../../models/order.model';
import { orderFilterDefaults } from '../../../models/order-filter.model';
import { orderTableConfig } from '../../../config/order-table.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { getActionConfig } from '../../../config/order-actions-dialog.config';
import { DialogDynamicConfig } from '@shared/types/dialog-dynamic.type';
import { ImageUploadService } from '@shared/images/services/image-upload.service';

@Component({
  selector: 'app-order-actives-table',
  standalone: true,
  imports: [
    DataTableComponent,
    FilterDynamicComponent,
    OrderActionsDialogComponent,
  ],
  templateUrl: './order-actives-table.component.html',
})
export class OrderActivesTableComponent {
  readonly router = inject(Router);
  readonly store = inject(OrderStore);
  private readonly imageUpload = inject(ImageUploadService);

  // ── Gestión Dinámica de Diálogos ────────────────────────────
  protected readonly actionDialogVisible = signal(false);
  protected readonly currentActionConfig = signal<DialogDynamicConfig | null>(
    null,
  );
  protected readonly currentActionType = signal<string | null>(null);

  protected readonly selectedOrder = signal<Order | null>(null);
  protected readonly drawerVisible = signal(false);

  // Delega al store: true si cualquier operación async está en curso
  public readonly isActionLoading = this.store.isActionLoading;

  // ─────────────────────────────────────────────────────────────
  // CONFIGURACIÓN DE TABLA
  // ─────────────────────────────────────────────────────────────

  readonly tableConfig = orderTableConfig({
    onViewOrder: (order: Order) => {
      this.router.navigate(['/ventas/pedidos', order.id]);
    },
    onAction: (actionType: string, order: Order) => {
      if (actionType === 'mark-processing') {
        this.store.executeAction(actionType, { orderId: order.id });
        return;
      }
      this.openActionDialog(actionType, order);
    },
  });

  // ── Gestión Dinámica de Acciones ───────────────────────────
  public async openActionDialog(action: string, order: Order): Promise<void> {
    let targetOrder = order;

    // Obtener detalles completos para tener productImageUrl y demás relaciones pesadas
    if (action === 'create-claim' || action === 'cancel-order') {
      const detail = await this.store.getOrderDetailAsync(order.id);
      if (detail) {
        targetOrder = detail;
      }
    }

    const config = getActionConfig(action, targetOrder, this.imageUpload);
    if (!config) return;

    this.selectedOrder.set(targetOrder);
    this.currentActionConfig.set(config);
    this.currentActionType.set(action);
    this.actionDialogVisible.set(true);
  }

  public onActionSubmit(formData: Record<string, any>): void {
    console.log('formData', formData);
    const order = this.selectedOrder();
    const action = this.currentActionType();
    if (!order || !action) return;

    console.log('action', action);

    this.store.executeAction(action, {
      payload: formData,
      orderId: order.id,
      onSuccess: () => {
        this.actionDialogVisible.set(false);
        this.currentActionConfig.set(null);
        this.currentActionType.set(null);
        this.selectedOrder.set(null);
      },
    });
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
}
