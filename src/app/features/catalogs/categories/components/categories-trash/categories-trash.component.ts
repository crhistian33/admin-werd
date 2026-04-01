// src/app/features/catalogs/categories/components/categories-trash/categories-trash.component.ts

import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStore } from '../../store/category.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { categoryTrashTableConfig } from '../../config/category-trash-table.config';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories-trash',
  imports: [DataTableComponent],
  templateUrl: './categories-trash.component.html',
  // Sin providers: [CategoryStore] — usa el store del padre (singleton compartido)
})
export class CategoriesTrashComponent {
  private readonly router = inject(Router);
  // Mismo store que CategoriesActiveComponent — sincronización automática
  readonly store = inject(CategoryStore);
  private readonly dialog = inject(DialogService);

  readonly table = viewChild(DataTableComponent);

  readonly tableConfig = categoryTrashTableConfig(this.router, {
    onRestore: (category) => this.onRestore(category),
    onDelete: (category) => this.onDeletePermanently(category),
  });

  // Usa el índice del filtro de papelera, no el de activos
  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.trashFilter();
    return (page - 1) * limit;
  });

  onRestore(category: Category): void {
    this.dialog.confirm({
      message: `¿Restaurar la categoría <strong>${category.name}</strong>?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        this.store.restore(category.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== category.id),
          );
        });
      },
    });
  }

  onDeletePermanently(category: Category): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${category.name}</strong> permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(category.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== category.id),
          );
        });
      },
    });
  }

  onRestoreAll(categories: Category[]): void {
    this.dialog.confirm({
      message: `¿Restaurar <strong>${categories.length}</strong> categorías seleccionadas?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        const ids = categories.map((c) => c.id);
        this.store.restoreAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onDeleteAllPermanently(categories: Category[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${categories.length}</strong> categorías permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = categories.map((c) => c.id);
        this.store.deleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  // Paginación y búsqueda usan trashFilter — independiente del filter de activos
  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;
    this.store.setTrashFilter({ page, limit } as any);
  }

  handleSearch(query: string): void {
    this.store.setTrashFilter({ search: query, page: 1 } as any);
  }
}
