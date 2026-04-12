import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { HeroSlideStore } from '../../store/hero-slide.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { heroSlideTrahsTableConfig } from '../../config/hero-slide-trash-table.config';
import { HeroSlide } from '../../models/hero-slide.model';
import { HeroSlideFilter } from '../../models/hero-slide-filter.model';

@Component({
  selector: 'app-hero-slide-trash',
  imports: [DataTableComponent],
  templateUrl: './hero-slide-trash.component.html',
  styleUrl: './hero-slide-trash.component.scss',
})
export class HeroSlideTrashComponent {
  readonly router = inject(Router);
  readonly store = inject(HeroSlideStore);
  private readonly dialog = inject(DialogService);

  readonly table = viewChild(DataTableComponent);

  readonly tableConfig = heroSlideTrahsTableConfig(this.router, {
    onRestore: (heroSlide) => this.onRestore(heroSlide),
    onDelete: (heroSlide) => this.onDeletePermanently(heroSlide),
  });

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  onRestore(heroSlide: HeroSlide): void {
    this.dialog.confirm({
      message: `¿Restaurar el slide <strong>${heroSlide.title}</strong>?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        this.store.restore(heroSlide.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== heroSlide.id),
          );
        });
      },
    });
  }

  onDeletePermanently(heroSlide: HeroSlide): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${heroSlide.title}</strong> permanentemente?
                  <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(heroSlide.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== heroSlide.id),
          );
        });
      },
    });
  }

  onRestoreAll(heroSlides: HeroSlide[]): void {
    this.dialog.confirm({
      message: `¿Restaurar <strong>${heroSlides.length}</strong> slides seleccionados?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        const ids = heroSlides.map((p) => p.id);
        this.store.restoreAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onDeleteAllPermanently(heroSlides: HeroSlide[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${heroSlides.length}</strong> slides permanentemente?
                  <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = heroSlides.map((p) => p.id);
        this.store.deleteAll(ids, () => {
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
    } as unknown as HeroSlideFilter);
  }

  // --- Eventos tabla ---
  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;
    this.store.setTrashFilter({ page, limit } as any);
  }

  handleSearch(query: string): void {
    this.store.setTrashFilter({ search: query, page: 1 } as any);
  }
}
