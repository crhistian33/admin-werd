import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '@shared/services/ui/dialog.service';
import { BrandStore } from '../../store/brand.store';
import { brandTableConfig } from '../../config/brand-table.config';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brand-list',
  imports: [DataTableComponent],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss',
})
export class BrandListComponent {
  readonly router = inject(Router);
  readonly store = inject(BrandStore);
  private readonly dialog = inject(DialogService);

  readonly tableConfig = brandTableConfig(this.router, {
    onDelete: (brand) => this.onDelete(brand),
  });

  readonly table = viewChild(DataTableComponent);

  // --- Paginación sincronizada ---
  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  // --- Acciones ---
  onDelete(brand: Brand): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la marca <strong>${brand.name}</strong>?<br>No se podrá reestablecer la acción`,
      onAccept: () => {
        this.store.delete(brand.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== brand.id),
          );
          this.dialog.success(
            `Marca ${brand.name} eliminada`,
            'Eliminación exitosa',
          );
        });
      },
    });
  }

  onDeleteAll(brands: Brand[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${brands.length}</strong> ${brands.length === 1 ? 'marca seleccionada' : 'marcas seleccionadas'}?<br>No se podrá reestablecer la acción`,
      onAccept: () => {
        const ids = brands.map((b) => b.id);
        this.store.deleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
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
