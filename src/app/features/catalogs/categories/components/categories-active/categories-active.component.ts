import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStore } from '../../store/category.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { categoryTableConfig } from '../../config/category-table.config';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { Category } from '../../models/category.model';
import { CategoryFilter } from '../../models/category-filter.model';

@Component({
  selector: 'app-categories-active',
  imports: [DataTableComponent, FilterDynamicComponent],
  templateUrl: './categories-active.component.html',
  // Sin providers: [CategoryStore] — usa el store del padre (singleton compartido)
})
export class CategoriesActiveComponent {
  readonly router = inject(Router);
  // Store inyectado desde el padre — compartido con CategoriesTrashComponent
  readonly store = inject(CategoryStore);
  private readonly dialog = inject(DialogService);

  readonly drawerVisible = signal(false);

  readonly tableConfig = categoryTableConfig(this.router, {
    onDelete: (category) => this.onSoftDelete(category),
  });

  readonly filterFields = computed<FilterFieldConfig[]>(() =>
    this.tableConfig.columns
      .filter((col) => col.filter?.enabled)
      .map((col) => ({
        key: col.field as string,
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

  onSoftDelete(category: Category): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la categoría <strong>${category.name}</strong>?
                <br>Podrás recuperarla desde la papelera.`,
      onAccept: () => {
        this.store.softDelete(category.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== category.id),
          );
        });
      },
    });
  }

  onSoftDeleteAll(categories: Category[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${categories.length}</strong> registros seleccionados?
                <br>Se moverán a la papelera.`,
      onAccept: () => {
        const ids = categories.map((c) => c.id);
        this.store.softDeleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handleClearFilters(): void {
    this.store.setFilter({
      isActive: null,
      search: null,
      page: 1,
    } as unknown as CategoryFilter);
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
