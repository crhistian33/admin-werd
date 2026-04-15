import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { ProductStore } from '../../store/product.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { productTableConfig } from '../../config/product-table.config';
import { Product, ProductStatus } from '../../models/product.model';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { productFilterDefaults } from '../../models/product-filter.model';
import { CategoryStore } from '@features/catalogs/categories/store/category.store';
import { BrandStore } from '@features/catalogs/brands/store/brand.store';

@Component({
  selector: 'app-products-active',
  imports: [DataTableComponent, FilterDynamicComponent],
  templateUrl: './products-active.component.html',
  styleUrl: './products-active.component.scss',
})
export class ProductsActiveComponent {
  readonly router = inject(Router);
  readonly store = inject(ProductStore);
  readonly categoryStore = inject(CategoryStore);
  readonly brandStore = inject(BrandStore);
  private readonly dialog = inject(DialogService);

  readonly tableConfig = computed(() => {
    const categories = this.categoryStore.data();
    const brands = this.brandStore.data();
    return productTableConfig(
      this.router,
      {
        onDelete: (product) => this.onSoftDelete(product),
        onBulkStatusChange: (ids, status) =>
          this.onBulkStatusChange(ids, status),
      },
      { categories, brands },
    );
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

  onBulkStatusChange(ids: string[], status: ProductStatus): void {
    const labels: Record<ProductStatus, string> = {
      active: 'publicar',
      inactive: 'archivar',
      draft: 'pasar a borrador',
      out_of_stock: 'marcar sin stock',
    };

    this.dialog.confirm({
      message: `¿${labels[status].charAt(0).toUpperCase() + labels[status].slice(1)} <strong>${ids.length}</strong> producto(s) seleccionado(s)?`,
      acceptLabel: 'Confirmar',
      onAccept: () => {
        this.store.changeStatusProduct(ids, status, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onSoftDelete(product: Product): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar el producto <strong>${product.name}</strong>?<br>Podrá recuperarlo en la papelera`,
      onAccept: () => {
        this.store.softDelete(product.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== product.id),
          );
        });
      },
    });
  }

  onSoftDeleteAll(products: Product[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${products.length}</strong> registros seleccionados?
                  <br>Se moverán a la papelera.`,
      onAccept: () => {
        const ids = products.map((p) => p.id);
        this.store.softDeleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handleClearFilters(): void {
    this.store.setFilter(productFilterDefaults());
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
