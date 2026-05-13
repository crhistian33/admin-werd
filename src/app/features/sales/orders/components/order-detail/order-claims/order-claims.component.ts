import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { OrderClaim } from '../../../models/order-claim.model';
import {
  CLAIM_TYPE_LABELS,
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_SEVERITY,
  REASON_CATEGORY_LABELS,
} from '../../../models/order-claim.model';
import {
  CLAIM_TYPE_SEVERITY_MAP,
  getClaimActions,
} from '../../../utils/order-calculations.utils';
import { Severity } from '@shared/types/severity.type';

@Component({
  selector: 'app-order-claims',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ButtonModule, TagModule, TooltipModule],
  templateUrl: './order-claims.component.html',
})
export class OrderClaimsComponent {
  readonly claims = input.required<OrderClaim[]>();
  readonly getProductImageUrl = input.required<(url?: string) => string>();

  readonly claimAction = output<{ type: string; claim: OrderClaim }>();

  protected readonly CLAIM_TYPE_LABELS = CLAIM_TYPE_LABELS;
  protected readonly CLAIM_STATUS_LABELS = CLAIM_STATUS_LABELS;
  protected readonly CLAIM_STATUS_SEVERITY = CLAIM_STATUS_SEVERITY;
  protected readonly CLAIM_TYPE_SEVERITY_MAP = CLAIM_TYPE_SEVERITY_MAP;
  protected readonly REASON_CATEGORY_LABELS = REASON_CATEGORY_LABELS;

  protected getClaimActions(claim: OrderClaim): Array<{
    type: string;
    icon: string;
    tooltip: string;
    severity: Severity;
  }> {
    return getClaimActions(claim);
  }

  protected handleClaimAction(claim: OrderClaim, actionType: string): void {
    this.claimAction.emit({ type: actionType, claim });
  }
}
