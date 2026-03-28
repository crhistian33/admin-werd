import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStore } from '../../store/category.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { categoryTableConfig } from '../../config/category-table.config';
import { Category } from '../../models/category.model';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  readonly router = inject(Router);
  readonly store = inject(CategoryStore);
  private readonly dialog = inject(DialogService);

  // Configuración de la tabla (columnas, acciones, etc.)
  readonly tableConfig = categoryTableConfig(this.router, {
    onDelete: (category) => this.onDelete(category),
  });

  // Referencia al componente tabla (para manipular selección manualmente)
  readonly table = viewChild(DataTableComponent);

  /**
   * Calcula el índice de la primera fila visible basado en página y limit
   * Usado para mantener sincronizado el estado del p-table con el store
   */
  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  // ============================================================
  // ACCIONES DE FILA
  // ============================================================

  /**
   * Elimina una categoría con confirmación del usuario
   */
  onDelete(category: Category): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la categoría <strong>${category.name}</strong>?<br>Esta acción no se puede deshacer.`,
      onAccept: () => {
        this.store.delete(category.id, () => {
          // Limpiar fila de la selección local
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== category.id),
          );
        });
      },
    });
  }

  /**
   * Elimina múltiples categorías con confirmación
   */
  onDeleteAll(categories: Category[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${categories.length}</strong> registros seleccionados?<br>Esta acción no se puede deshacer.`,
      onAccept: () => {
        const ids = categories.map((c) => c.id);
        this.store.deleteAll(ids, () => {
          // Limpiar selección local
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  // ============================================================
  // EVENTOS DE LA TABLA
  // ============================================================

  /**
   * Maneja el evento de paginación (next, prev, jump to page, change rows per page)
   * El p-table envía: { first: number, rows: number }
   * Calculamos: page = first / rows + 1, limit = rows
   */
  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;

    // Actualizar filtro en el store → dispara nuevaHttpResource
    this.store.setFilter({ page, limit } as any);
  }

  /**
   * Maneja búsqueda global
   * Siempre reseteamos a página 1 al buscar
   */
  handleSearch(query: string): void {
    this.store.setFilter({ search: query, page: 1 } as any);
  }
}
