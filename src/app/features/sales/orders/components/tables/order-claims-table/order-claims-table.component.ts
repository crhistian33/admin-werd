import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpContext, httpResource, HttpParams } from '@angular/common/http';
import { DataTableComponent } from '@shared/components/ui/data-table/data-table.component';
import { FilterDynamicComponent } from '@shared/components/ui/filter-dynamic/filter-dynamic.component';
import { OrderActionsDialogComponent } from '../../dialogs/order-actions-dialog/order-actions-dialog.component';
import { getActionConfig } from '../../../config/order-actions-dialog.config';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { claimTableConfig } from '../../../config/order-claim.config';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { OrderClaim } from '../../../models';
import { ApiResponse } from '@core/models/api-response.model';
import { environment } from '@env/environment';
import { IS_PUBLIC } from '@core/auth/context/auth.context';
import { OrderStore } from '../../../store/order.store';

@Component({
  selector: 'app-order-claims-table',
  standalone: true,
  imports: [
    DataTableComponent,
    FilterDynamicComponent,
    OrderActionsDialogComponent,
  ],
  templateUrl: './order-claims-table.component.html',
})
export class OrderClaimsTableComponent {
  private readonly router = inject(Router);
  private readonly store = inject(OrderStore);

  private readonly imageUpload = inject(ImageUploadService);

  protected readonly drawerVisible = signal(false);
  protected readonly actionDialogVisible = signal(false);
  protected readonly currentActionType = signal<string | null>(null);

  protected readonly selectedClaim = signal<OrderClaim | null>(null);

  // Delega al store: true si cualquier operación async está en curso
  public readonly isActionLoading = this.store.isActionLoading;

  protected readonly actionConfig = computed(() => {
    const action = this.currentActionType();
    const order = this.store.selected();
    if (!action || !order) return null;
    return getActionConfig(
      action,
      order,
      this.imageUpload,
      undefined,
      this.selectedClaim() || undefined,
    );
  });

  protected readonly filter = signal<Record<string, any>>({
    page: 1,
    limit: 10,
    search: '',
  });

  private readonly _resource = httpResource<ApiResponse<OrderClaim[]>>(() => {
    this.store.claimsLastUpdated(); // Reactividad para refrescar al alterar reclamos
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

    // ✅ PENDING → Abrir diálogo de revisión
    onReview: (claim) => this.openActionDialog('review-claim', claim),

    onRegisterShipment: (claim) =>
      this.openActionDialog('register-return-shipment', claim),

    // ✅ APPROVED + envío confirmado → Registrar recepción
    onMarkReceived: (claim) => this.openActionDialog('mark-received', claim),

    // ✅ RECEIVED + REFUND → Procesar reembolso
    onProcessRefund: (claim) => this.openActionDialog('complete-refund', claim),

    // ✅ RECEIVED + REPLACEMENT → Generar reemplazo
    onProcessReplacement: (claim) => {
      this.store.completeReplacement(claim.id, claim.orderId, () => {
        // La lista se refresca reactivamente por el signal claimsLastUpdated()
      });
    },
    isActionLoading: () => this.isActionLoading(),
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

  public openActionDialog(action: string, claim: OrderClaim): void {
    this.selectedClaim.set(claim);
    this.currentActionType.set(action);
    // Cargamos el pedido completo para tener contexto (paymentMethod, items, etc)
    this.store.getById(claim.orderId);
    this.actionDialogVisible.set(true);
  }

  public onActionSubmit(formData: any): void {
    const action = this.currentActionType();
    const claim = this.selectedClaim();
    if (!action || !claim) return;

    this.store.executeAction(action, {
      payload: formData,
      claim,
      orderId: claim.orderId,
      onSuccess: () => {
        this.actionDialogVisible.set(false);
        this.selectedClaim.set(null);
        this.currentActionType.set(null);
        // La lista se autoevalúa porque las mutaciones triggerClaimsReload internamente
      },
    });
  }
}
