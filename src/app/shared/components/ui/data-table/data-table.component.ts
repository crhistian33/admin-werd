import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import type {
  DataTableConfig,
  TableColumn,
  BadgeConfig,
} from '../../../types/data-table.type';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-data-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    RouterLink,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends Record<string, any>> {
  readonly router = inject(Router);
  // ── Outputs ─────────────────────────────────────────────────
  readonly searchChange = output<string>();
  readonly filterDrawer = output<void>();
  // ── Inputs ──────────────────────────────────────────────────
  readonly data = input.required<T[]>();
  readonly config = input.required<DataTableConfig<T>>();
  readonly loading = input<boolean>(false);
  readonly isSaving = input<boolean>(false); // ← controla el skeleton por mutaciones
  readonly hasFilters = input<boolean>(false); // ← controla el color del botón
  readonly showFilter = input<boolean>(false);

  // ── Two-way binding para selección ──────────────────────────
  readonly selectedRows = model<T[]>([]);

  // ── Outputs ─────────────────────────────────────────────────
  readonly selectionChange = output<T[]>();
  readonly deleteAll = output<T[]>();

  // ── ViewChild ───────────────────────────────────────────────
  private readonly table = viewChild<Table>('dt');

  // ── Computed ────────────────────────────────────────────────
  // readonly filterFields = computed(() =>
  //   this.config()
  //     .columns.filter((c) => c.type !== 'actions' && c.type !== 'image')
  //     .map((c) => c.field.toString()),
  // );

  readonly totalColumns = computed(() => {
    const base = this.config().columns.length;
    return this.config().selectable ? base + 1 : base;
  });

  // Filas skeleton durante loading
  readonly skeletonRows = Array(3);

  // ── Métodos ─────────────────────────────────────────────────

  /** Obtiene el valor de una celda, aplicando format si existe */
  getValue(row: T, col: TableColumn<T>): any {
    const value = (col.field as string)
      .split('.')
      .reduce((obj: any, key) => obj?.[key], row);

    return col.format ? col.format(value, row) : value;
  }

  /** Busca la config de badge para un valor dado */
  getBadge(col: TableColumn<T>, value: any): BadgeConfig | undefined {
    return col.badges?.find((b) => b.value === value);
  }

  /** Filtra la tabla globalmente */
  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
    //this.table()?.filterGlobal(input.value, 'contains');
  }

  /** Emite cambios de selección */
  onSelectionChange(rows: T[]): void {
    this.selectedRows.set(rows);
    this.selectionChange.emit(rows);
  }

  /** Emite evento para eliminar selección */
  onDeleteAll(): void {
    if (this.selectedRows().length > 0) {
      this.deleteAll.emit(this.selectedRows());
    }
  }
}
