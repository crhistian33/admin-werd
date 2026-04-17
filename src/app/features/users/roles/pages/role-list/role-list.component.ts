import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { RoleStore } from '../../store/role.store';
import { roleTableConfig } from '../../config/role-table.config';
import { roleFilterDefaults } from '../../models/role-filter.model';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';

@Component({
  selector: 'app-role-list',
  imports: [DataTableComponent, FilterDynamicComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent {
  private readonly router = inject(Router);
  readonly store = inject(RoleStore);

  readonly tableConfig = roleTableConfig(this.router);
  readonly drawerVisible = signal(false);

  readonly filterFields = computed<FilterFieldConfig[]>(() => {
    return this.tableConfig.columns
      .filter((col) => col.filter?.enabled)
      .map((col) => ({
        key: (col.filterField ?? col.field) as string,
        label: col.header,
        type: col.filter!.type,
        options: col.filter!.options,
        placeholder: `Filtrar por ${col.header.toLowerCase()}`,
      }));
  });

  readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.store.filter();
    return (page - 1) * limit;
  });

  handleClearFilters(): void {
    this.store.setFilter(roleFilterDefaults());
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
