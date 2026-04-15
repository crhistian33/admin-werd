import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { ShippingZoneStore } from '../../store/shipping-zone.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { shippingZoneTableConfig } from '../../config/shipping-zone-table.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { ShippingZone } from '../../models/shipping.model';
import { shippingZoneFilterDefaults } from '../../models/shipping-filter.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-shipping-zone-active',
  imports: [DataTableComponent, FilterDynamicComponent, ButtonModule],
  templateUrl: './shipping-zone-active.component.html',
  styleUrl: './shipping-zone-active.component.scss',
})
export class ShippingZoneActiveComponent {
  readonly router = inject(Router);
  readonly store = inject(ShippingZoneStore);
  private readonly dialog = inject(DialogService);

  readonly drawerVisible = signal(false);

  readonly tableConfig = shippingZoneTableConfig(this.router, {
    onDelete: (item) => this.onSoftDelete(item),
    onBulkStatusChange: (ids, status) => this.onBulkStatusChange(ids, status),
  });

  readonly filterFields = computed<FilterFieldConfig[]>(() =>
    this.tableConfig.columns
      .filter((col) => col.filter?.enabled)
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

  onBulkStatusChange(ids: string[], status: boolean): void {
    const actionText = status ? 'activar' : 'desactivar';

    this.dialog.confirm({
      message: `¿Deseas ${actionText} <strong>${ids.length}</strong> zona(s) de envío seleccionada(s)?`,
      acceptLabel: 'Confirmar',
      onAccept: () => {
        this.store.changeStatus(ids, status, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  onSoftDelete(shippingZone: ShippingZone): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar la zona de envío <strong>${shippingZone.name}</strong>?
                <br>Podrás recuperarla desde la papelera.`,
      onAccept: () => {
        this.store.softDelete(shippingZone.id, () => {
          this.table()?.selectedRows.update((rows: any[]) =>
            rows.filter((r) => r.id !== shippingZone.id),
          );
        });
      },
    });
  }

  onSoftDeleteAll(shippingZones: ShippingZone[]): void {
    this.dialog.delete({
      message: `¿Está seguro de eliminar <strong>${shippingZones.length}</strong> registros seleccionados?
                <br>Se moverán a la papelera.`,
      onAccept: () => {
        const ids = shippingZones.map((c) => c.id);
        this.store.softDeleteAll(ids, () => {
          this.table()?.selectedRows.set([]);
        });
      },
    });
  }

  handleClearFilters(): void {
    this.store.setFilter(shippingZoneFilterDefaults());
  }

  handlePagination(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const limit = event.rows;
    this.store.setFilter({ page, limit } as any);
  }

  handleSearch(query: string): void {
    this.store.setFilter({ search: query, page: 1 } as any);
  }
}
