import { Component, inject, viewChild } from '@angular/core';
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

  onDelete(brand: Brand): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la marca <strong>${brand.name}</strong>?. <br>No se podrá reestablecer la acción`,
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
      message: `¿Está seguro de eliminar <strong>${brands.length}</strong> ${brands.length === 1 ? 'marca seleccionada' : 'marcas seleccionadas'}. <br>No se podrá reestablecer la acción`,
      onAccept: () => {
        const ids = brands.map((b) => b.id);
        this.store.deleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }
}
