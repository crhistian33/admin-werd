import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { PaymentMethodStore } from '../../store/payment-method.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { paymentMethodTableConfig } from '../../config/payment-method-table.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { PaymentMethod } from '../../models/payment-method.model';
import { ButtonModule } from 'primeng/button';
import { paymentMethodFilterDefaults } from '../../models/payment-method-filter.model';
import { DialogModule } from 'primeng/dialog';
import { PaymentMethodReorderComponent } from '../../components/payment-method-reorder/payment-method-reorder.component';

@Component({
  selector: 'app-payment-method-list',
  standalone: true,
  imports: [
    DataTableComponent,
    FilterDynamicComponent,
    ButtonModule,
    DialogModule,
    PaymentMethodReorderComponent,
  ],
  templateUrl: './payment-method-list.component.html',
})
export class PaymentMethodListComponent {
  readonly router = inject(Router);
  readonly store = inject(PaymentMethodStore);
  private readonly dialog = inject(DialogService);

  readonly drawerVisible = signal(false);
  readonly reorderVisible = signal(false);
  readonly table = viewChild(DataTableComponent);

  // Configuración de la tabla con callbacks
  readonly tableConfig = computed(() => {
    return paymentMethodTableConfig(this.router, {
      onDelete: (method) => this.onDelete(method),
      onBulkStatusChange: (ids, status) => this.onBulkStatusChange(ids, status),
    });
  });

  // Generación dinámica de filtros basados en la configuración de columnas
  readonly filterFields = computed<FilterFieldConfig[]>(() =>
    this.tableConfig()
      .columns.filter((col) => col.filter?.enabled)
      .map((col) => ({
        key: (col.filterField ?? col.field) as string,
        label: col.header,
        type: col.filter!.type,
        options: col.filter!.options,
        placeholder: `Filtrar por ${col.header.toLowerCase()}`,
      })),
  );

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  onBulkStatusChange(ids: string[], status: boolean): void {
    const actionText = status ? 'activar' : 'desactivar';

    this.dialog.confirm({
      message: `¿Deseas ${actionText} <strong>${ids.length}</strong> método(s) de pago seleccionado(s)?`,
      acceptLabel: 'Confirmar',
      onAccept: () => {
        this.store.changeStatus(ids, status, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  // --- Acciones de Borrado (Sin Soft-Delete) ---

  onDelete(method: PaymentMethod): void {
    this.dialog.delete({
      message: `¿Eliminar el método de pago <strong>${method.name}</strong>?
                <br><br>Esta acción eliminará permanentemente la configuración y <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(method.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== method.id),
          );
        });
      },
    });
  }

  onDeleteAll(methods: PaymentMethod[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${methods.length}</strong> métodos de pago permanentemente?
                <br><br>Esta acción no se puede deshacer.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = methods.map((m) => m.id);
        this.store.deleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  // --- Manejo de Filtros y Tabla ---

  handleClearFilters(): void {
    this.store.setFilter(paymentMethodFilterDefaults());
  }

  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;
    this.store.setFilter({ page, limit } as any);
  }

  handleSearch(query: string): void {
    this.store.setFilter({ search: query, page: 1 } as any);
  }
}
