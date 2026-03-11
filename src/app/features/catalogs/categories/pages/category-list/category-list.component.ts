import { Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStore } from '../../store/category.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { categoryTableConfig } from '../../config/category-table.config';
import { Category } from '../../models/category.model';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';

@Component({
  selector: 'app-category-list',
  imports: [DataTableComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  readonly router = inject(Router);
  readonly store = inject(CategoryStore);
  private readonly dialog = inject(DialogService);

  readonly tableConfig = categoryTableConfig(this.router, {
    onDelete: (category) => this.onDelete(category),
  });

  readonly table = viewChild(DataTableComponent);

  onDelete(category: Category): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la categoría <strong>${category.name}</strong>?. <br>No se podrá reestablecer la acción`,
      onAccept: () => {
        this.store.delete(category.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== category.id),
          );
          this.dialog.success(
            `Categoría ${category.name} eliminada`,
            'Eliminación exitosa',
          );
        });
      },
    });
  }

  onDeleteAll(categories: Category[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${categories.length}</strong> ${categories.length === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}. <br>No se podrá reestablecer la acción`,
      onAccept: () => {
        const ids = categories.map((c) => c.id);
        this.store.deleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }
}
