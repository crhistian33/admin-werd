import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStore } from '../../store/customer.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { customerTableConfig } from '../../config/customer-table.config';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { Customer } from '../../models/customer.model';
import { customerFilterDefaults } from '../../models/customer-filter.model';

@Component({
  selector: 'app-customer-active',
  standalone: true,
  imports: [DataTableComponent, FilterDynamicComponent],
  templateUrl: './customer-active.component.html',
})
export class CustomerActiveComponent {
  readonly router = inject(Router);
  readonly store = inject(CustomerStore);
  private readonly dialog = inject(DialogService);

  readonly drawerVisible = signal(false);

  readonly tableConfig = computed(() => {
    return customerTableConfig(this.router, {
      onDelete: (customer) => this.onSoftDelete(customer),
      onBulkStatusChange: (ids, status) => this.onBulkStatusChange(ids, status),
    });
  });

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

  readonly table = viewChild(DataTableComponent);

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  onBulkStatusChange(ids: string[], status: boolean): void {
    const actionText = status ? 'activar' : 'desactivar';

    this.dialog.confirm({
      message: `¿Deseas ${actionText} <strong>${ids.length}</strong> cliente(s) seleccionado(s)?`,
      acceptLabel: 'Confirmar',
      onAccept: () => {
        this.store.changeStatus(ids, status, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onSoftDelete(customer: Customer): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar al cliente <strong>${customer.firstName} ${customer.lastName}</strong>?
                <br>Podrás recuperarlo desde la papelera.`,
      onAccept: () => {
        this.store.softDelete(customer.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== customer.id),
          );
        });
      },
    });
  }

  onSoftDeleteAll(customers: Customer[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${customers.length}</strong> registros seleccionados?
                <br>Se moverán a la papelera.`,
      onAccept: () => {
        const ids = customers.map((c) => c.id);
        this.store.softDeleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handleClearFilters(): void {
    this.store.setFilter(customerFilterDefaults());
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
