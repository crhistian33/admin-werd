import { computed, signal, inject, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpContext, httpResource } from '@angular/common/http';
import type { BaseFilter } from '@shared/models/base-filter.model';
import type { BaseService } from '../services/base.service';
import { DialogService } from '@shared/services/ui/dialog.service';

import { IS_PUBLIC } from '@core/auth/context/auth.context';
import { ApiResponse } from '@core/models/api-response.model';

export abstract class BaseStore<
  T extends { id?: number | string },
  F extends BaseFilter = BaseFilter,
> {
  private readonly destroy = inject(DestroyRef);
  private readonly dialog = inject(DialogService);

  protected abstract readonly service: BaseService<T>;

  readonly filter = signal<F>({
    page: 1,
    limit: 10,
    search: '',
    //isActive: true,
  } as F);

  private readonly hasLoadedOnce = signal(false);

  // 1. Nueva señal para persistir los datos anteriores (El "Cache")
  private readonly _lastValidData = signal<T[]>([]);

  private readonly resource = httpResource<ApiResponse<T[]>>(() => {
    if (!this.service?.url) return undefined;
    const f = this.filter();

    return {
      url: this.service.url,
      context: new HttpContext().set(IS_PUBLIC, false),
      params: {
        page: (f.page ?? 1).toString(),
        limit: (f.limit ?? 10).toString(),
        search: f.search ?? '',
        //isActive: String(f.isActive ?? true),
      },
    };
  });

  constructor() {
    effect(() => {
      const res = this.resource.value();
      const status = this.resource.status();

      // 2. Si la petición se resuelve con datos, actualizamos nuestra memoria
      if (status === 'resolved' && res?.data) {
        this._lastValidData.set(res.data);
        if (!this.hasLoadedOnce()) this.hasLoadedOnce.set(true);
      }

      // 3. Si hay error, limpiamos la memoria
      if (status === 'error') {
        this._lastValidData.set([]);
      }
    });
  }

  readonly items = computed(() => {
    return this.resource.value()?.data ?? [];
  });

  // 4. DATA OPTIMIZADA: Nunca devuelve [] mientras carga, si ya tenía datos previos
  readonly data = computed(() => {
    const status = this.resource.status();

    // Si está cargando o refrescando, devolvemos lo que tenemos en memoria
    if (status === 'loading' || status === 'reloading') {
      return this._lastValidData();
    }

    return this.resource.value()?.data ?? [];
  });

  readonly loadingState = computed(() => ({
    initial: this.resource.isLoading() && !this.hasLoadedOnce(),
    updating: this.resource.isLoading() && this.hasLoadedOnce(),
  }));

  readonly totalItems = computed<number>(() => {
    return this.resource.value()?.meta?.total ?? 0;
  });

  // --- RESTO DEL STORE (Igual al tuyo para no romper nada) ---

  readonly selectedId = signal<string | null>(null);
  readonly isSaving = signal(false);

  private readonly detailResource = httpResource<ApiResponse<T>>(() => {
    const id = this.selectedId();
    if (!id || !this.service) return undefined;
    return `${this.service.url}/${id}`;
  });

  readonly selected = computed<T | null>(() => {
    return this.detailResource.value()?.data ?? null;
  });

  setSelected(item: T | null): void {
    if (item && 'id' in item && item.id) {
      this.selectedId.set(item.id as string);
    } else {
      this.selectedId.set(null);
    }
  }

  protected applySearch(items: T[], fields: (keyof T)[]): T[] {
    const q = this.filter().search?.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      fields
        .map((f) => String(item[f] ?? '').toLowerCase())
        .some((val) => val.includes(q)),
    );
  }

  setFilter(partial: Partial<F>): void {
    this.filter.update((f) => ({ ...f, ...partial }));
  }

  setPage(page: number) {
    this.setFilter({ page } as Partial<F>);
  }
  getById(id: string) {
    this.selectedId.set(id);
    // Forzar recarga del detalle cada vez que se navega
    this.detailResource.reload();
  }
  reload(): void {
    this.resource.reload();
  }

  create(payload: Partial<T>, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          const message = res.message || 'Registro creado exitosamente';
          this.isSaving.set(false);
          this.dialog.success(message, 'Creación exitosa');
          this.reload();
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  update(id: string, payload: Partial<T>, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .update(id, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          const message = res.message || 'Registro actualizado exitosamente';
          this.isSaving.set(false);
          this.dialog.success(message, 'Actualización exitosa');
          this.reload();
          // Forzar recarga del detalle actualizado
          this.detailResource.reload();
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  delete(id: string, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          const message = res.message || 'Registro eliminado exitosamente';
          this.dialog.success(message, 'Eliminación exitosa');
          this.reload();
          onSuccess?.();
        },
        error: (err) => {
          console.log('Error al eliminar:', err);
          this.isSaving.set(false);
        },
      });
  }

  deleteAll(ids: string[], onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .deleteAll(ids)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          const message = res.message || 'Registros eliminados exitosamente';
          this.dialog.success(message, 'Eliminación exitosa');
          this.reload();
          onSuccess?.();
        },
        error: (err) => {
          console.log('Error al eliminar:', err);
          this.isSaving.set(false);
        },
      });
  }
}
