import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageStore } from '../../store/page.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { pageTableConfig } from '../../config/staticpage-table.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { Page, PageStatus } from '../../models/page.model';
import { pageFilterDefaults } from '../../models/page-filter.model';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';

@Component({
  selector: 'app-pages-active',
  imports: [DataTableComponent, FilterDynamicComponent],
  templateUrl: './pages-active.component.html',
  styleUrl: './pages-active.component.scss',
})
export class PagesActiveComponent {
  readonly router = inject(Router);
  readonly store = inject(PageStore);
  private readonly dialog = inject(DialogService);

  readonly drawerVisible = signal(false);

  readonly tableConfig = pageTableConfig(this.router, {
    onDelete: (page) => this.onSoftDelete(page),
    onBulkStatusChange: (ids, status) => this.onBulkStatusChange(ids, status),
  });

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

  readonly table = viewChild(DataTableComponent);

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  onBulkStatusChange(ids: string[], status: PageStatus): void {
    const labels: Record<PageStatus, string> = {
      published: 'Publicar',
      draft: 'Cambiar a borrador',
    };

    this.dialog.confirm({
      message: `¿${labels[status].charAt(0).toUpperCase() + labels[status].slice(1)} <strong>${ids.length}</strong> página(s) seleccionada(s)?`,
      acceptLabel: 'Confirmar',
      onAccept: () => {
        this.store.changeStatus(ids, status, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onSoftDelete(page: Page): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la página <strong>${page.title}</strong>?
                <br>Podrás recuperarla desde la papelera.`,
      onAccept: () => {
        this.store.softDelete(page.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== page.id),
          );
        });
      },
    });
  }

  onSoftDeleteAll(pages: Page[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${pages.length}</strong> registros seleccionados?
                <br>Se moverán a la papelera.`,
      onAccept: () => {
        const ids = pages.map((c) => c.id);
        this.store.softDeleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handleClearFilters(): void {
    this.store.setFilter(pageFilterDefaults());
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
