import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BrandStore } from '../../store/brand.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { brandTableConfig } from '../../config/brand-table.config';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { Brand } from '../../models/brand.model';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { BrandFilter } from '../../models/brand-filter.model';

@Component({
  selector: 'app-brands-active',
  imports: [DataTableComponent, FilterDynamicComponent],
  templateUrl: './brands-active.component.html',
  styleUrl: './brands-active.component.scss',
})
export class BrandsActiveComponent {
  readonly router = inject(Router);
  readonly store = inject(BrandStore);
  private readonly dialog = inject(DialogService);

  readonly tableConfig = brandTableConfig(this.router, {
    onDelete: (brand) => this.onSoftDelete(brand),
  });

  readonly table = viewChild(DataTableComponent);

  readonly drawerVisible = signal(false);

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

  // --- Paginación sincronizada ---
  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  // --- Acciones ---
  onSoftDelete(brand: Brand): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la marca <strong>${brand.name}</strong>?<br>. Podrás recuperarla desde la papelera`,
      onAccept: () => {
        this.store.softDelete(brand.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== brand.id),
          );
        });
      },
    });
  }

  onDeleteAll(brands: Brand[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${brands.length}</strong> ${brands.length === 1 ? 'marca seleccionada' : 'marcas seleccionadas'}?<br>. Podrás recuperarlas desde la papelera`,
      onAccept: () => {
        const ids = brands.map((b) => b.id);
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
    } as unknown as BrandFilter);
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
