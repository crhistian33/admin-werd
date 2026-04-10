import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { PageStore } from '../../store/page.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { pageTrashTableConfig } from '../../config/staticpage-trash-table.config';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-pages-trash',
  imports: [DataTableComponent],
  templateUrl: './pages-trash.component.html',
  styleUrl: './pages-trash.component.scss',
})
export class PagesTrashComponent {
  private readonly router = inject(Router);
  readonly store = inject(PageStore);
  private readonly dialog = inject(DialogService);

  readonly table = viewChild(DataTableComponent);

  readonly tableConfig = pageTrashTableConfig(this.router, {
    onRestore: (page) => this.onRestore(page),
    onDelete: (page) => this.onDeletePermanently(page),
  });

  // Usa el índice del filtro de papelera, no el de activos
  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.trashFilter();
    return (page - 1) * limit;
  });

  onRestore(page: Page): void {
    this.dialog.confirm({
      message: `¿Restaurar la página <strong>${page.title}</strong>?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        this.store.restore(page.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== page.id),
          );
        });
      },
    });
  }

  onDeletePermanently(page: Page): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${page.title}</strong> permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(page.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== page.id),
          );
        });
      },
    });
  }

  onRestoreAll(pages: Page[]): void {
    this.dialog.confirm({
      message: `¿Restaurar <strong>${pages.length}</strong> páginas seleccionadas?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        const ids = pages.map((c) => c.id);
        this.store.restoreAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onDeleteAllPermanently(pages: Page[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${pages.length}</strong> páginas permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = pages.map((c) => c.id);
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
