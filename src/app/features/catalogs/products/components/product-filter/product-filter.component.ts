import { Component, inject, model } from '@angular/core';
import { ProductStore } from '../../store/product.store';
import { ProductStatus } from '../../models/product.model';
import { FilterDrawerComponent } from '@shared/components/ui/filter-drawer/filter-drawer.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  imports: [FilterDrawerComponent, FloatLabelModule, SelectModule, FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
})
export class ProductFilterComponent {
  readonly store = inject(ProductStore);
  readonly visible = model<boolean>(false);

  selectedStatus: ProductStatus | null = null;

  readonly statusOptions: { label: string; value: ProductStatus }[] = [
    { label: 'Activo', value: 'success' },
    { label: 'Inactivo', value: 'warning' },
  ];

  readonly clearFilters = (): void => {
    this.selectedStatus = null;
    this.store.setFilter({ status: null });
  };
}
