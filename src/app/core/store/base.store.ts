import {
  computed,
  signal,
  inject,
  DestroyRef,
  Injector,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpContext, httpResource } from '@angular/common/http';
import type { BaseFilter } from '@shared/models/base-filter.model';
import type { BaseService } from '../services/base.service';
import { DialogService } from '@shared/services/ui/dialog.service';
import { ApiResponse } from '@shared/models/api-response.model';
import { IS_PUBLIC } from '@core/auth/context/auth.context';

export abstract class BaseStore<
  T extends object,
  F extends BaseFilter = BaseFilter,
> {
  private readonly destroy = inject(DestroyRef);
  private readonly dialog = inject(DialogService);

  // ── Cada feature define su URL via su service ────────────────
  protected abstract readonly service: BaseService<T>;

  // ── Filtro — cada feature define el suyo ────────────────────
  readonly filter = signal<F>({
    page: 1,
    limit: 10,
    search: '',
    isActive: true,
  } as F);

  // ── filteredItems — cada feature implementa su lógica ────────
  abstract readonly filteredItems: ReturnType<typeof computed<T[]>>;

  // ── httpResource — GET automático al instanciar ──────────────
  private readonly resource = httpResource<T[]>(() => {
    const currentFilter = this.filter();
    const page = 1;
    const limit = 10;

    return {
      url: this.service?.url,
      context: new HttpContext().set(IS_PUBLIC, false),
      params: {
        page: page.toString(),
        limit: limit.toString(),
        search: currentFilter.search,
        isActive: String(currentFilter.isActive),
      },
    };
  });

  // ── Estado individual ──────────────────────────────────────────
  readonly selectedId = signal<number | null>(null);
  readonly isSaving = signal(false);

  // ── httpResource — GET automático del detalle ──────────────────
  private readonly detailResource = httpResource<T>(() => {
    const id = this.selectedId();

    if (!id || !this.service) return undefined;

    const url = `${this.service.url}/${id}`;

    return url;
  });

  // ── Estado público ───────────────────────────────────────────
  readonly loading = computed(
    () => this.resource.isLoading() || this.detailResource.isLoading(),
  );

  readonly items = computed(() => {
    if (this.resource.status() === 'error') return [];

    const res = this.resource.value() as any;
    console.log('[BaseStore] Resource response:', res);
    return res?.data ?? [];
  });

  readonly totalItems = computed(
    () => (this.resource.value() as any)?.total ?? 0,
  );

  readonly error = computed(() => {
    if (
      this.resource.status() === 'error' ||
      this.detailResource.status() === 'error'
    ) {
      return 'Error al cargar los datos';
    }
    return null;
  });

  readonly selected = linkedSignal<T | null>(() => {
    if (this.detailResource.status() === 'error') return null;
    return this.detailResource.value() ?? null;
  });

  // ── Mutaciones — recarga el resource al completar ────────────
  create(payload: Partial<T>, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialog.success(
            'Registro creado exitosamente',
            'Creación exitosa',
          );
          this.reload();
          onSuccess?.();
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }

  update(id: number, payload: Partial<T>, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .update(id, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialog.success(
            'Registro actualizado exitosamente',
            'Actualización exitosa',
          );
          this.reload();
          onSuccess?.();
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }

  delete(id: number, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.reload();
          if (this.selectedId() === id) {
            this.selectedId.set(null);
          }
          onSuccess?.();
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }

  deleteAll(ids: number[], onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .deleteAll(ids)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialog.success(
            `${ids.length} registros eliminados exitosamente`,
            'Eliminación exitosa',
          );
          this.reload();
          // Limpiar la selección si alguno de los eliminados estaba seleccionado (opcional, pero buena práctica)
          if (this.selectedId() && ids.includes(this.selectedId()!)) {
            this.selectedId.set(null);
          }
          onSuccess?.();
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
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

  // ── Método para obtener el detalle ───────────────────────────
  getById(id: number) {
    console.log('[BaseStore] getById called with id:', id);
    this.selectedId.set(id);
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

  setPage(page: number) {
    this.setFilter({ page } as Partial<F>);
  }
}
