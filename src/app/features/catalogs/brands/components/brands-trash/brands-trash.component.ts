import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BrandStore } from '../../store/brand.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { brandTrashTableConfig } from '../../config/brand-trash-table.config';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brands-trash',
  imports: [DataTableComponent],
  templateUrl: './brands-trash.component.html',
  styleUrl: './brands-trash.component.scss',
})
export class BrandsTrashComponent {
  private readonly router = inject(Router);
  // Mismo store que CategoriesActiveComponent — sincronización automática
  readonly store = inject(BrandStore);
  private readonly dialog = inject(DialogService);

  readonly table = viewChild(DataTableComponent);

  readonly tableConfig = brandTrashTableConfig(this.router, {
    onRestore: (brand) => this.onRestore(brand),
    onDelete: (brand) => this.onDeletePermanently(brand),
  });

  // Usa el índice del filtro de papelera, no el de activos
  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.trashFilter();
    return (page - 1) * limit;
  });

  onRestore(brand: Brand): void {
    this.dialog.confirm({
      message: `¿Restaurar la marca <strong>${brand.name}</strong>?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        this.store.restore(brand.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== brand.id),
          );
        });
      },
    });
  }

  onDeletePermanently(brand: Brand): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${brand.name}</strong> permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(brand.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== brand.id),
          );
        });
      },
    });
  }

  onRestoreAll(brands: Brand[]): void {
    this.dialog.confirm({
      message: `¿Restaurar <strong>${brands.length}</strong> marcas seleccionadas?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        const ids = brands.map((c) => c.id);
        this.store.restoreAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onDeleteAllPermanently(brands: Brand[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${brands.length}</strong> marcas permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = brands.map((c) => c.id);
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
