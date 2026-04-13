import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { FaqStore } from '../../store/faq.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { faqTableConfig } from '../../config/faq-table.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { Faq } from '../../models/faq.model';
import { faqFilterDefaults } from '../../models/faq-filter.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FaqReorderComponent } from '../../components/faq-reorder/faq-reorder.component';

@Component({
  selector: 'app-faq-list',
  imports: [
    DataTableComponent,
    FilterDynamicComponent,
    ButtonModule,
    DialogModule,
    FaqReorderComponent,
  ],
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.scss',
})
export class FaqListComponent {
  readonly router = inject(Router);
  readonly store = inject(FaqStore);
  private readonly dialog = inject(DialogService);

  readonly reorderVisible = signal(false);

  readonly tableConfig = computed(() => {
    return faqTableConfig(this.router, {
      onDelete: (faq) => this.onDelete(faq),
    });
  });

  readonly drawerVisible = signal(false);

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

  // --- Acciones ---

  onDelete(faq: Faq): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${faq.question}</strong>?
                  <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(faq.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== faq.id),
          );
        });
      },
    });
  }

  onDeleteAll(faqs: Faq[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${faqs.length}</strong> pregunta(s) permanentemente?
                  <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = faqs.map((p) => p.id);
        this.store.deleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handleClearFilters(): void {
    this.store.setFilter(faqFilterDefaults());
  }

  // --- Eventos tabla ---
  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;
    this.store.setFilter({ page, limit } as any);
  }

  handleSearch(query: string): void {
    this.store.setFilter({ search: query, page: 1 } as any);
  }
}
