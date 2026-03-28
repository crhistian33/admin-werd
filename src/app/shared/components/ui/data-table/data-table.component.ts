import {
  Component,
  computed,
  ElementRef,
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
import { Router, RouterLink } from '@angular/router';

// PrimeNG 20 Modules
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

@Component({
  selector: 'app-data-table',
  standalone: true,
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
})
export class DataTableComponent<T extends Record<string, any>> {
  readonly router = inject(Router);

  private readonly el = inject(ElementRef);

  // ============================================================
  // INPUTS
  // ============================================================
  readonly data = input.required<T[]>();
  readonly totalItems = input<number>(0);
  readonly config = input.required<DataTableConfig<T>>();

  // Control de carga (desde el padre - store.loadingState)
  readonly loading = input<boolean>(false); // Muestra skeleton SOLO en carga inicial
  readonly isUpdating = input<boolean>(false);
  readonly isSaving = input<boolean>(false); // Carga silenciosa (sin skeleton)

  // Paginación
  readonly rows = input<number>(10);
  readonly first = input<number>(0);

  // ============================================================
  // TWO-WAY BINDING & OUTPUTS
  // ============================================================
  readonly selectedRows = model<T[]>([]);

  readonly searchChange = output<string>();
  readonly filterDrawer = output<void>();
  readonly onPageChange = output<any>();
  readonly deleteAll = output<T[]>();

  // ============================================================
  // INTERNALS
  // ============================================================
  private readonly table = viewChild<Table>('dt');
  // skeletonRows nunca debe ser vacío para evitar que PrimeNG muestre emptymessage durante loading
  get skeletonRows(): any[] {
    const count = this.rows?.() || 10;
    return Array(Math.max(count, 1)).fill(0);
  }

  // ============================================================
  // COMPUTED
  // ============================================================

  /** Total de columnas (incluyendo checkbox si aplica) */
  readonly totalColumns = computed(() => {
    const base = this.config().columns.length;
    return this.config().selectable ? base + 1 : base;
  });

  // ============================================================
  // MÉTODOS PÚBLICOS
  // ============================================================

  /**
   * Extrae el valor de una fila por campo con soporte para rutas (ej: 'address.city')
   */
  getValue(row: T, col: TableColumn<T>): any {
    const value = (col.field as string)
      .split('.')
      .reduce((obj: any, key) => obj?.[key], row);
    return col.format ? col.format(value, row) : value;
  }

  /**
   * Obtiene la configuración de badge para un valor en una columna
   */
  getBadge(col: TableColumn<T>, value: any): BadgeConfig | undefined {
    return col.badges?.find((b) => b.value === value.toString());
  }

  /**
   * Emite cambios de búsqueda global
   */
  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  /**
   * Emite solicitud de eliminación en lote
   */
  onDeleteAll(): void {
    if (this.selectedRows().length > 0) {
      this.deleteAll.emit(this.selectedRows());
    }
  }

  /**
   * Maneja el evento onLazyLoad del p-table (llamado al paginar)
   */
  onLazyLoad(event: any): void {
    const main = this.el.nativeElement.closest('main') as HTMLElement | null;
    main?.scrollTo({ top: 0, behavior: 'smooth' });

    this.onPageChange.emit(event);
  }
}
