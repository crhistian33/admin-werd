// src/app/core/store/base.store.ts

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
  readonly destroy = inject(DestroyRef);
  readonly dialog = inject(DialogService);

  protected abstract readonly service: BaseService<T>;

  // Añadimos una propiedad para saber si este Store debe manejar papelera
  protected readonly canUseSoftDelete: boolean;

  // ── Filtro para la lista de activos ───────────────────────────────
  readonly filter = signal<F>({
    page: 1,
    limit: 10,
    search: '',
  } as F);

  // ── Filtro para la papelera — independiente del anterior ──────────
  readonly trashFilter = signal<F>({
    page: 1,
    limit: 10,
    search: '',
    onlyTrash: true,
  } as F);

  private readonly hasLoadedOnce = signal(false);
  private readonly hasTrashLoadedOnce = signal(false);

  readonly loadingId = signal<string | null>(null);
  readonly isSaving = signal(false);

  // ── Cache de datos ────────────────────────────────────────────────
  private readonly _lastValidData = signal<T[]>([]);
  private readonly _lastValidTrashData = signal<T[]>([]);

  // ── Resource de activos ───────────────────────────────────────────
  private readonly _activeResource = httpResource<ApiResponse<T[]>>(() => {
    if (!this.service?.url) return undefined;
    const f = this.filter() as Record<string, any>;
    const params = this.buildParams(f);
    return {
      url: this.service.url,
      context: new HttpContext().set(IS_PUBLIC, false),
      params,
    };
  });

  // ── Resource de papelera ──────────────────────────────────────────
  private readonly _trashResource = httpResource<ApiResponse<T[]>>(() => {
    if (!this.service?.url || !this.canUseSoftDelete) return undefined;
    const f = this.trashFilter() as Record<string, any>;
    const params = this.buildParams(f);
    return {
      url: this.service.url,
      context: new HttpContext().set(IS_PUBLIC, false),
      params,
    };
  });

  constructor(options: { useSoftDelete: boolean } = { useSoftDelete: true }) {
    this.canUseSoftDelete = options.useSoftDelete;

    // Actualiza cache de activos
    effect(() => {
      const res = this._activeResource.value();
      const status = this._activeResource.status();

      if (status === 'resolved' && res?.data) {
        this._lastValidData.set(res.data);
        if (!this.hasLoadedOnce()) this.hasLoadedOnce.set(true);
      }
      if (status === 'error') {
        this._lastValidData.set([]);
      }
    });

    // Actualiza cache de papelera
    effect(() => {
      const res = this._trashResource.value();
      const status = this._trashResource.status();

      if (status === 'resolved' && res?.data) {
        this._lastValidTrashData.set(res.data);
        if (!this.hasTrashLoadedOnce()) this.hasTrashLoadedOnce.set(true);
      }
      if (status === 'error') {
        this._lastValidTrashData.set([]);
      }
    });
  }

  // ── Selectores de activos ─────────────────────────────────────────

  readonly data = computed(() => {
    const status = this._activeResource.status();
    if (status === 'loading' || status === 'reloading') {
      return this._lastValidData();
    }
    return this._activeResource.value()?.data ?? [];
  });

  readonly totalItems = computed<number>(() => {
    return this._activeResource.value()?.meta?.total ?? 0;
  });

  readonly loadingState = computed(() => ({
    initial: this._activeResource.isLoading() && !this.hasLoadedOnce(),
    updating: this._activeResource.isLoading() && this.hasLoadedOnce(),
  }));

  // ── Selectores de papelera ────────────────────────────────────────

  readonly trashData = computed(() => {
    const status = this._trashResource.status();
    if (status === 'loading' || status === 'reloading') {
      return this._lastValidTrashData();
    }
    return this._trashResource.value()?.data ?? [];
  });

  readonly trashTotalItems = computed<number>(() => {
    return this._trashResource.value()?.meta?.total ?? 0;
  });

  readonly trashLoadingState = computed(() => ({
    initial: this._trashResource.isLoading() && !this.hasTrashLoadedOnce(),
    updating: this._trashResource.isLoading() && this.hasTrashLoadedOnce(),
  }));

  // ── Filtros ───────────────────────────────────────────────────────

  readonly activeFiltersCount = computed(() => {
    const f = this.filter() as Record<string, any>;
    const internalKeys = ['page', 'limit', 'search'];
    return Object.keys(f).filter((key) => {
      const value = f[key];
      return (
        !internalKeys.includes(key) &&
        value !== null &&
        value !== undefined &&
        value !== ''
      );
    }).length;
  });

  setFilter(partial: Partial<F>): void {
    this.filter.update((f) => ({ ...f, ...partial }));
  }

  setTrashFilter(partial: Partial<F>): void {
    this.trashFilter.update((f) => ({ ...f, ...partial }));
  }

  // ── Detail resource ───────────────────────────────────────────────

  readonly selectedId = signal<string | null>(null);

  private readonly detailResource = httpResource<ApiResponse<T>>(() => {
    const id = this.selectedId();
    if (!id || !this.service) return undefined;
    return `${this.service.url}/${id}`;
  });

  readonly selected = computed<T | null>(() => {
    return this.detailResource.value()?.data ?? null;
  });

  getById(id: string): void {
    this.selectedId.set(id);
    this.detailResource.reload();
  }

  setSelected(item: T | null): void {
    if (item && 'id' in item && item.id) {
      this.selectedId.set(item.id as string);
    } else {
      this.selectedId.set(null);
    }
  }

  // ── Recarga ambos resources ───────────────────────────────────────

  reload(): void {
    this._activeResource.reload();
    this._trashResource.reload();
  }

  reloadActive(): void {
    this._activeResource.reload();
  }

  reloadTrash(): void {
    this._trashResource.reload();
  }

  // ── CRUD ──────────────────────────────────────────────────────────

  create(payload: Partial<T>, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.dialog.success(
            res.message || 'Registro creado',
            'Operación exitosa',
          );
          this.reloadActive();
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
          this.isSaving.set(false);
          this.dialog.success(
            res.message || 'Registro actualizado',
            'Operación exitosa',
          );
          this.reloadActive();
          this.selectedId.set(null);
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  // SoftDelete — recarga ambos (el item pasa de activos a papelera)
  softDelete(id: string, onSuccess?: () => void): void {
    this.loadingId.set(id);
    this.service
      .softDelete(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.loadingId.set(null);
          this.dialog.success(
            res.message || 'Movido a papelera',
            'Operación exitosa',
          );
          this.reload(); // ambos resources — activos pierde 1, papelera gana 1
          onSuccess?.();
        },
        error: () => this.loadingId.set(null),
      });
  }

  softDeleteAll(ids: string[], onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .softDeleteAll(ids)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.dialog.success(
            res.message || 'Movidos a papelera',
            'Operación exitosa',
          );
          this.reload();
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  // Restore — recarga ambos (el item pasa de papelera a activos)
  restore(id: string, onSuccess?: () => void): void {
    this.loadingId.set(id);
    this.service
      .restore(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.loadingId.set(null);
          this.dialog.success(res.message || 'Restaurado', 'Operación exitosa');
          this.reload(); // ambos resources
          onSuccess?.();
        },
        error: () => this.loadingId.set(null),
      });
  }

  restoreAll(ids: string[], onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .restoreAll(ids)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.dialog.success(
            res.message || 'Restaurados',
            'Operación exitosa',
          );
          this.reload();
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  // Delete permanente — solo recarga papelera y activos para actualizar trashedCount
  delete(id: string, onSuccess?: () => void): void {
    this.loadingId.set(id);
    this.service
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.loadingId.set(null);
          this.dialog.success(
            res.message || 'Eliminado permanentemente',
            'Operación exitosa',
          );
          this.reload();
          onSuccess?.();
        },
        error: () => this.loadingId.set(null),
      });
  }

  deleteAll(ids: string[], onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .deleteAll(ids)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.dialog.success(
            res.message || 'Eliminados permanentemente',
            'Operación exitosa',
          );
          this.reload();
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  // ── Helper privado ────────────────────────────────────────────────

  private buildParams(f: Record<string, any>): Record<string, string> {
    const params: Record<string, string> = {};
    Object.keys(f).forEach((key) => {
      const value = f[key];
      if (value !== null && value !== undefined && value !== '') {
        params[key] = value;
      }
    });
    return params;
  }
}
