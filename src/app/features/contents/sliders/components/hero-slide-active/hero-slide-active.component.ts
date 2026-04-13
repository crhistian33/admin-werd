import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { HeroSlideStore } from '../../store/hero-slide.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { heroSlideTableConfig } from '../../config/hero-slide-table.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { HeroSlide } from '../../models/hero-slide.model';
import { heroSlideFilterDefaults } from '../../models/hero-slide-filter.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HeroSlideReorderComponent } from '../hero-slide-reorder/hero-slide-reorder.component';

@Component({
  selector: 'app-hero-slide-active',
  imports: [
    DataTableComponent,
    FilterDynamicComponent,
    HeroSlideReorderComponent,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './hero-slide-active.component.html',
  styleUrl: './hero-slide-active.component.scss',
})
export class HeroSlideActiveComponent {
  readonly router = inject(Router);
  readonly store = inject(HeroSlideStore);
  private readonly dialog = inject(DialogService);

  readonly reorderVisible = signal(false);

  readonly tableConfig = computed(() => {
    return heroSlideTableConfig(this.router, {
      onDelete: (heroSlide) => this.onSoftDelete(heroSlide),
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

  onSoftDelete(heroSlide: HeroSlide): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar el slide <strong>${heroSlide.title}</strong>?<br>Podrá recuperarlo en la papelera`,
      onAccept: () => {
        this.store.softDelete(heroSlide.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== heroSlide.id),
          );
        });
      },
    });
  }

  onSoftDeleteAll(heroSlides: HeroSlide[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${heroSlides.length}</strong> registros seleccionados?
                  <br>Se moverán a la papelera.`,
      onAccept: () => {
        const ids = heroSlides.map((p) => p.id);
        this.store.softDeleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handleClearFilters(): void {
    this.store.setFilter(heroSlideFilterDefaults());
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
