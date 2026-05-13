import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

// Store (única fuente de verdad)
import { OrderStore } from '../../store/order.store';

// Utilidades
import * as OrderUtils from '../../utils/order-calculations.utils';

// Config de acciones
import { getActionConfig } from '../../config/order-actions-dialog.config';

// Servicios
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { environment } from '@env/environment';

// Modelos
import { OrderStatusHistory } from '../../models/order.model';
import { OrderClaim, CLAIM_TYPE_LABELS } from '../../models/order-claim.model';
import { DialogDynamicConfig } from '@shared/types/dialog-dynamic.type';

// Componentes hijos
import { OrderDetailHeaderComponent } from '../../components/order-detail/order-detail-header/order-detail-header.component';
import { OrderItemsTableComponent } from '../../components/order-detail/order-items-table/order-items-table.component';
import { OrderTimelineComponent } from '../../components/order-detail/order-timeline/order-timeline.component';
import { OrderTransactionsComponent } from '../../components/order-detail/order-transactions/order-transactions.component';
import { OrderClaimsComponent } from '../../components/order-detail/order-claims/order-claims.component';
import { OrderSidebarComponent } from '../../components/order-detail/order-sidebar/order-sidebar.component';
import { OrderProfitabilityComponent } from '../../components/order-detail/order-profitability/order-profitability.component';
import { OrderActionsDialogComponent } from '../../components/dialogs/order-actions-dialog/order-actions-dialog.component';
import { OrderActionDetailDialogComponent } from '../../components/dialogs/order-action-detail-dialog/order-action-detail-dialog.component';

/** Acciones que se ejecutan directamente sin abrir diálogo */
const DIRECT_ACTIONS = new Set(['mark-processing', 'complete-replacement']);

/** Mapeo de acciones de claims a tipos de diálogo */
const CLAIM_DIALOG_MAP: Record<string, string> = {
  review: 'review-claim',
  'register-shipment': 'register-return-shipment',
  'mark-received': 'mark-received',
  'complete-refund': 'complete-refund',
  'complete-replacement': 'complete-replacement',
};

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    SkeletonModule,
    ButtonModule,
    OrderDetailHeaderComponent,
    OrderItemsTableComponent,
    OrderTimelineComponent,
    OrderTransactionsComponent,
    OrderClaimsComponent,
    OrderSidebarComponent,
    OrderProfitabilityComponent,
    OrderActionsDialogComponent,
    OrderActionDetailDialogComponent,
  ],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  readonly id = input.required<string>();
  readonly store = inject(OrderStore);
  private readonly router = inject(Router);
  private readonly imageUpload = inject(ImageUploadService);

  readonly actionDialogVisible = signal(false);
  readonly currentActionConfig = signal<DialogDynamicConfig | null>(null);
  readonly currentActionType = signal<string | null>(null);
  readonly actionDetailVisible = signal(false);
  readonly actionDetailHeader = signal<string>('Detalles de la Acción');
  readonly selectedEventForDetail = signal<OrderStatusHistory | null>(null);
  readonly selectedClaimForAction = signal<OrderClaim | undefined>(undefined);

  readonly order = this.store.currentOrder;
  readonly isLoading = this.store.isDetailLoading;

  readonly isActionLoading = this.store.isActionLoading;

  readonly availableActions = computed(() =>
    this.store.availableActions().map((action) => ({
      label: action.label,
      icon: action.icon,
      severity: action.severity,
      loading: action.loading,
      action: DIRECT_ACTIONS.has(action.actionType)
        ? () => this.store.executeAction(action.actionType)
        : () => this.openActionDialog(action.actionType),
    })),
  );

  // ── Ciclo de vida ──────────────────────────────────────
  ngOnInit(): void {
    this.store.getById(this.id());
  }

  openActionDialog(actionType: string, context?: { claim?: OrderClaim }): void {
    const order = this.order();
    if (!order) return;

    const claim = context?.claim || this.selectedClaimForAction();

    const config = getActionConfig(
      actionType,
      order,
      this.imageUpload,
      this.store.adjustedGrandTotal(),
      claim,
    );
    if (!config) return;

    if (context?.claim) {
      this.selectedClaimForAction.set(context.claim);
    }

    this.currentActionConfig.set(config);
    this.currentActionType.set(actionType);
    this.actionDialogVisible.set(true);
  }

  onActionSubmit(formData: Record<string, any>): void {
    const actionType = this.currentActionType();
    if (!actionType) return;

    this.store.executeAction(actionType, {
      payload: formData,
      claim: this.selectedClaimForAction(),
      onSuccess: () => {
        this.actionDialogVisible.set(false);
        this.selectedClaimForAction.set(undefined);
        this.currentActionConfig.set(null);
        this.currentActionType.set(null);
      },
    });
  }

  closeActionDialog(): void {
    this.actionDialogVisible.set(false);
    this.selectedClaimForAction.set(undefined);
    this.currentActionConfig.set(null);
    this.currentActionType.set(null);
  }

  openActionDetail(event: OrderStatusHistory): void {
    let header = OrderUtils.getTimelineLabel(event);

    // Si es un reclamo (fromStatus === toStatus), buscamos el número
    if (event.fromStatus === event.toStatus) {
      const claims = this.order()?.claims ?? [];
      const comment = event.comment?.toLowerCase() ?? '';
      const claim = claims.find((c) =>
        comment.includes(c.claimNumber.toLowerCase()),
      );

      if (claim) {
        const typeLabel = CLAIM_TYPE_LABELS[claim.type] || 'Reclamo';
        header = `${typeLabel} (${claim.claimNumber})`;
      }
    }

    this.actionDetailHeader.set(header);
    this.selectedEventForDetail.set(event);
    this.actionDetailVisible.set(true);
  }

  closeActionDetail(): void {
    this.selectedEventForDetail.set(null);
  }

  handleClaimAction(event: { type: string; claim: OrderClaim }): void {
    this.selectedClaimForAction.set(event.claim);

    if (DIRECT_ACTIONS.has(event.type)) {
      this.store.executeAction(event.type, {
        claim: event.claim,
        onSuccess: () => this.selectedClaimForAction.set(undefined),
      });
      return;
    }

    const dialogAction = CLAIM_DIALOG_MAP[event.type] || event.type;
    this.openActionDialog(dialogAction, { claim: event.claim });
  }

  getProductImageUrl(url?: string): string {
    return OrderUtils.getProductImageUrl(url, environment.apiImagesUrl);
  }

  goBack(): void {
    this.router.navigate(['/ventas/pedidos']);
  }

  scrollToClaimsSection(): void {
    document
      .getElementById('claims-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToCustomerProfile(customerId: string): void {
    void this.router.navigate(['/ventas/clientes', customerId], {
      queryParams: { from: 'order-detail', orderId: this.id() },
    });
  }
}
