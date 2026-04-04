import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductStore } from '../../store/product.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { productTableConfig } from '../../config/product-table.config';
import { Product } from '../../models/product.model';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { ButtonModule } from 'primeng/button';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { CommonModule } from '@angular/common';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { ProductFilter } from '../../models/product-filter.model';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { productTrashTableConfig } from '../../config/product-trash-table.config';

@Component({
  selector: 'app-products-trash',
  imports: [
    CommonModule,
    DataTableComponent,
    ButtonModule,
    ProductFilterComponent,
    FilterDynamicComponent,
  ],
  templateUrl: './products-trash.component.html',
  styleUrl: './products-trash.component.scss',
})
export class ProductsTrashComponent {
  readonly router = inject(Router);
  readonly store = inject(ProductStore);
  private readonly dialog = inject(DialogService);

  readonly table = viewChild(DataTableComponent);

  readonly tableConfig = productTrashTableConfig(this.router, {
    onRestore: (product) => this.onRestore(product),
    onDelete: (product) => this.onDeletePermanently(product),
  });

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  onRestore(product: Product): void {
    this.dialog.confirm({
      message: `¿Restaurar el producto <strong>${product.name}</strong>?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        this.store.restore(product.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== product.id),
          );
        });
      },
    });
  }

  onDeletePermanently(product: Product): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${product.name}</strong> permanentemente?
                  <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(product.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== product.id),
          );
        });
      },
    });
  }

  onRestoreAll(products: Product[]): void {
    this.dialog.confirm({
      message: `¿Restaurar <strong>${products.length}</strong> productos seleccionados?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        const ids = products.map((p) => p.id);
        this.store.restoreAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onDeleteAllPermanently(products: Product[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${products.length}</strong> productos permanentemente?
                  <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = products.map((p) => p.id);
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
    } as unknown as ProductFilter);
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
