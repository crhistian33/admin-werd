import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerStore } from '../../store/customer.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { customerTrashTableConfig } from '../../config/customer-trash-table.config';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-trash',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './customer-trash.component.html',
})
export class CustomerTrashComponent {
  readonly router = inject(Router);
  readonly store = inject(CustomerStore);
  private readonly dialog = inject(DialogService);

  readonly table = viewChild(DataTableComponent);

  readonly tableConfig = computed(() => {
    return customerTrashTableConfig(this.router, {
      onRestore: (customer) => this.onRestore(customer),
    });
  });

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.trashFilter();
    return (page - 1) * limit;
  });

  onRestore(customer: Customer): void {
    this.dialog.confirm({
      message: `¿Deseas restaurar al cliente <strong>${customer.firstName} ${customer.lastName}</strong>?`,
      onAccept: () => {
        this.store.restore(customer.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== customer.id),
          );
        });
      },
    });
  }

  onRestoreAll(customers: Customer[]): void {
    this.dialog.confirm({
      message: `¿Restaurar <strong>${customers.length}</strong> clientes seleccionados?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        const ids = customers.map((c) => c.id);
        this.store.restoreAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;
    this.store.setTrashFilter({ page, limit } as any);
  }

  handleSearch(query: string): void {
    this.store.setTrashFilter({ search: query, page: 1 } as any);
  }
}
