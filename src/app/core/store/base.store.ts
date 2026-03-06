import { computed, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, httpResource } from '@angular/common/http';
import type { BaseFilter } from '@shared/models/base-filter.model';
import type { BaseService } from '../services/base.service';

export abstract class BaseStore<T extends object, F extends BaseFilter> {
  private readonly http = inject(HttpClient);
  private readonly destroy = inject(DestroyRef);

  // ── Cada feature define su URL via su service ────────────────
  protected abstract readonly service: BaseService<T>;

  // ── Filtro — cada feature define el suyo ────────────────────
  abstract readonly filter: ReturnType<typeof signal<F>>;

  // ── filteredItems — cada feature implementa su lógica ────────
  abstract readonly filteredItems: ReturnType<typeof computed<T[]>>;

  // ── httpResource — GET automático al instanciar ──────────────
  private readonly resource = httpResource<T[]>(() => this.service.url);

  // ── Estado público ───────────────────────────────────────────
  readonly loading = this.resource.isLoading;
  readonly items = computed(() => this.resource.value() ?? []);
  readonly error = computed(() => {
    const status = this.resource.status();
    return status === 'error' ? 'Error al cargar los datos' : null;
  });
  readonly selected = signal<T | null>(null);

  // ── Mutaciones — recarga el resource al completar ────────────
  create(payload: Partial<T>): void {
    this.service
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(() => this.reload());
  }

  update(id: number, payload: Partial<T>): void {
    this.service
      .update(id, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(() => this.reload());
  }

  delete(id: number): void {
    this.service
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(() => this.reload());
  }

  // ── Métodos de filtro y selección ────────────────────────────
  setFilter(partial: Partial<F>): void {
    this.filter.update((f) => ({ ...f, ...partial }));
  }

  clearFilter(): void {
    this.filter.update((f) => ({ ...f, search: '' }));
  }

  setSelected(item: T | null): void {
    this.selected.set(item);
  }

  reload(): void {
    this.resource.reload();
  }

  // ── Helper de búsqueda por campos de texto ───────────────────
  protected applySearch(items: T[], fields: (keyof T)[]): T[] {
    const q = this.filter().search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) =>
      fields
        .map((f) => String(item[f] ?? '').toLowerCase())
        .some((val) => val.includes(q)),
    );
  }
}
