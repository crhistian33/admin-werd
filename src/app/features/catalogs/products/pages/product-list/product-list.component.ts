import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductStore } from '../../store/product.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { productTableConfig } from '../../config/product-table.config';
import { Product } from '../../models/product.model';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { ButtonModule } from 'primeng/button';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    DataTableComponent,
    ButtonModule,
    ProductFilterComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  readonly router = inject(Router);
  readonly store = inject(ProductStore);
  private readonly dialog = inject(DialogService);

  readonly tableConfig = productTableConfig(this.router, {
    onDelete: (product) => this.onDelete(product),
  });

  readonly drawerVisible = signal(false);

  // --- Paginación sincronizada ---
  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  // --- Acciones ---
  onDelete(product: Product): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar el producto <strong>${product.name}</strong>?<br>No se podrá reestablecer la acción`,
      onAccept: () => {
        this.store.delete(product.id);
        this.dialog.success(
          `Producto ${product.name} eliminado`,
          'Eliminación exitosa',
        );
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
