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
import { ReorderService } from '@shared/services/ui/reorder.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-faq-list',
  imports: [DataTableComponent, FilterDynamicComponent, ButtonModule],
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.scss',
})
export class FaqListComponent {
  readonly router = inject(Router);
  readonly store = inject(FaqStore);
  private readonly dialog = inject(DialogService);
  private readonly reorderService = inject(ReorderService);

  readonly tableConfig = computed(() => {
    return faqTableConfig(this.router, {
      onDelete: (faq) => this.onDelete(faq),
      onBulkStatusChange: (ids, status) => this.onBulkStatusChange(ids, status),
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

  onBulkStatusChange(ids: string[], status: boolean): void {
    const actionText = status ? 'activar' : 'desactivar';

    this.dialog.confirm({
      message: `¿Deseas ${actionText} <strong>${ids.length}</strong> pregunta(s) seleccionada(s)?`,
      acceptLabel: 'Confirmar',
      onAccept: () => {
        this.store.changeStatus(ids, status, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

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

  onOpenReorder(): void {
    this.reorderService.open({
      title: 'Reordenar Preguntas Frecuentes',
      items: this.store.data(),
      labelField: 'question',
      onSave: (ids) => {
        this.reorderService.setLoading(true);
        this.store.reorder(ids, () => {
          this.reorderService.close();
        });
      },
    });
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
