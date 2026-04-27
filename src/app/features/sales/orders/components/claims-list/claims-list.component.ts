// src/app/features/sales/orders/components/claims-list/claims-list.component.ts
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpContext, httpResource, HttpParams } from '@angular/common/http';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { OrderClaimReviewDialogComponent } from '../order-claim-review-dialog/order-claim-review-dialog.component';
import { OrderClaimService } from '../../services/order-claim.service';
import { claimTableConfig } from '../../config/order-claim.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { OrderClaim, ReviewClaimPayload } from '../../models/order-claim.model';
import { ApiResponse } from '@core/models/api-response.model';
import { environment } from '@env/environment';
import { IS_PUBLIC } from '@core/auth/context/auth.context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@shared/services/ui/dialog.service';

@Component({
  selector: 'app-claims-list',
  standalone: true,
  imports: [
    DataTableComponent,
    FilterDynamicComponent,
    OrderClaimReviewDialogComponent,
  ],
  templateUrl: './claims-list.component.html',
})
export class ClaimsListComponent {
  private readonly router = inject(Router);
  private readonly service = inject(OrderClaimService);
  private readonly dialog = inject(DialogService);
  private readonly destroy = inject(DestroyRef);

  protected readonly drawerVisible = signal(false);
  protected readonly reviewDialogVisible = signal(false);
  protected readonly selectedClaim = signal<OrderClaim | null>(null);
  protected readonly isReviewing = signal(false);

  // Estado de filtros (puede extenderse)
  protected readonly filter = signal<Record<string, any>>({
    page: 1,
    limit: 10,
    search: '',
  });

  // Resource reactivo
  private readonly _resource = httpResource<ApiResponse<OrderClaim[]>>(() => {
    const f = this.filter();
    let params = new HttpParams();
    Object.keys(f).forEach((key) => {
      const val = f[key];
      if (val !== null && val !== undefined && val !== '') {
        params = params.set(key, val);
      }
    });

    return {
      url: `${environment.apiUrl}/orders/claims`,
      context: new HttpContext().set(IS_PUBLIC, false),
      params,
    };
  });

  protected readonly claims = computed(
    () => this._resource.value()?.data ?? [],
  );
  protected readonly totalItems = computed(
    () => this._resource.value()?.meta?.total ?? 0,
  );
  protected readonly isLoading = this._resource.isLoading;

  protected readonly tableConfig = claimTableConfig({
    onViewOrder: (claim) =>
      this.router.navigate(['/ventas/pedidos', claim.orderId]),
    onUpdateStatus: (claim) => {
      this.selectedClaim.set(claim);
      this.reviewDialogVisible.set(true);
    },
    onDeleteClaim: (claim) => this.handleDeleteClaim(claim),
  });

  protected readonly filterFields = computed<FilterFieldConfig[]>(() =>
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

  protected readonly activeFiltersCount = computed(() => {
    const f = this.filter();
    const internalKeys = ['page', 'limit', 'search'];
    return Object.keys(f).filter((key) => !internalKeys.includes(key) && f[key])
      .length;
  });

  protected readonly firstRowIndex = computed(() => {
    const { page = 1, limit = 10 } = this.filter();
    return (page - 1) * limit;
  });

  handlePagination(event: { first: number; rows: number }): void {
    this.filter.update((f) => ({
      ...f,
      page: Math.floor(event.first / event.rows) + 1,
      limit: event.rows,
    }));
  }

  handleSearch(query: string): void {
    this.filter.update((f) => ({ ...f, search: query, page: 1 }));
  }

  handleFilterChange(filters: Record<string, unknown>): void {
    this.filter.update((f) => ({ ...f, ...filters, page: 1 }));
  }

  handleClearFilters(): void {
    this.filter.set({ page: 1, limit: 10, search: '' });
  }

  handleReview(payload: ReviewClaimPayload): void {
    const claim = this.selectedClaim();
    if (!claim) return;

    this.isReviewing.set(true);
    this.service
      .reviewClaim(claim.id, payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.isReviewing.set(false);
          this.dialog.success(res.message || 'Reclamación actualizada');
          this.reviewDialogVisible.set(false);
          this._resource.reload();
        },
        error: () => this.isReviewing.set(false),
      });
  }

  handleDeleteClaim(claim: OrderClaim): void {
    this.dialog.delete({
      title: 'Eliminar reclamación',
      message: '¿Estás seguro de que deseas eliminar permanentemente esta reclamación? Esta acción no se puede deshacer.',
      onAccept: () => {
        this.service
          .deleteClaim(claim.id)
          .pipe(takeUntilDestroyed(this.destroy))
          .subscribe({
            next: (res) => {
              this.dialog.success(res.message || 'Reclamación eliminada');
              this._resource.reload();
            },
            // El error es manejado por el ErrorInterceptor
          });
      },
    });
  }
}
