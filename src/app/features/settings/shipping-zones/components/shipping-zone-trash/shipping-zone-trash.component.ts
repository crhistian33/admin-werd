import { Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { ShippingZoneStore } from '../../store/shipping-zone.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { shippingZoneTrashTableConfig } from '../../config/shipping-zone-trash-table.config';
import { ShippingZone } from '../../models/shipping.model';

@Component({
  selector: 'app-shipping-zone-trash',
  imports: [DataTableComponent],
  templateUrl: './shipping-zone-trash.component.html',
  styleUrl: './shipping-zone-trash.component.scss',
})
export class ShippingZoneTrashComponent {
  private readonly router = inject(Router);
  readonly store = inject(ShippingZoneStore);
  private readonly dialog = inject(DialogService);

  readonly table = viewChild(DataTableComponent);

  readonly tableConfig = shippingZoneTrashTableConfig(this.router, {
    onRestore: (category) => this.onRestore(category),
    onDelete: (category) => this.onDeletePermanently(category),
  });

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.trashFilter();
    return (page - 1) * limit;
  });

  onRestore(shippingZone: ShippingZone): void {
    this.dialog.confirm({
      message: `¿Restaurar la zona de envío <strong>${shippingZone.name}</strong>?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        this.store.restore(shippingZone.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== shippingZone.id),
          );
        });
      },
    });
  }

  onDeletePermanently(shippingZone: ShippingZone): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${shippingZone.name}</strong> permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(shippingZone.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== shippingZone.id),
          );
        });
      },
    });
  }

  onRestoreAll(shippingZones: ShippingZone[]): void {
    this.dialog.confirm({
      message: `¿Restaurar <strong>${shippingZones.length}</strong> zonas de envío seleccionadas?`,
      acceptLabel: 'Restaurar',
      onAccept: () => {
        const ids = shippingZones.map((c) => c.id);
        this.store.restoreAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onDeleteAllPermanently(shippingZones: ShippingZone[]): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${shippingZones.length}</strong> zonas de envío permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        const ids = shippingZones.map((c) => c.id);
        this.store.deleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  // Paginación y búsqueda usan trashFilter — independiente del filter de activos
  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;
    this.store.setTrashFilter({ page, limit } as any);
  }

  handleSearch(query: string): void {
    this.store.setTrashFilter({ search: query, page: 1 } as any);
  }
}
