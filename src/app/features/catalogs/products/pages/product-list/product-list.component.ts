import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductStore } from '../../store/product.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { productTableConfig } from '../../config/product-table.config';
import { Product } from '../../models/product.model';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { ButtonModule } from 'primeng/button';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';

@Component({
  selector: 'app-product-list',
  imports: [DataTableComponent, ButtonModule, ProductFilterComponent],
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

  readonly hasActiveFilters = computed(() => {
    const { status } = this.store.filter();
    return !!status;
  });

  onDelete(product: Product): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar el producto <strong>${product.name}</strong>?. <br>No se podrá reestablecer la acción`,
      onAccept: () => {
        this.store.delete(product.id);
        this.dialog.success(
          `Producto ${product.name} eliminado`,
          'Eliminación exitosa',
        );
      },
    });
  }
}
