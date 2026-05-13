import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  ClaimStatus,
  ClaimType,
  RecentClaim,
} from '@features/dashboard/models/dashboard-response.model';
import { TagSeverity } from '@shared/types/severity.type';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';

const CLAIM_SEVERITY: Record<ClaimStatus, TagSeverity> = {
  PENDING: 'warn',
  APPROVED: 'info',
  REJECTED: 'danger',
  RECEIVED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'secondary',
};

const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  CANCELLATION: 'Cancelación',
  REFUND: 'Reembolso',
  REPLACEMENT: 'Reposición',
};

const CLAIM_TYPE_SEVERITY: Record<ClaimType, TagSeverity> = {
  CANCELLATION: 'danger',
  REFUND: 'warn',
  REPLACEMENT: 'info',
};

@Component({
  selector: 'app-dashboard-recent-claims',
  imports: [TableModule, TagModule, DatePipe, ButtonModule, RouterLink],
  templateUrl: './dashboard-recent-claims.component.html',
  styleUrl: './dashboard-recent-claims.component.scss',
})
export class DashboardRecentClaimsComponent {
  readonly claims = input<RecentClaim[]>([]);

  severity(status: ClaimStatus): TagSeverity {
    return CLAIM_SEVERITY[status] ?? 'secondary';
  }
  typeLabel(type: ClaimType): string {
    return CLAIM_TYPE_LABEL[type] ?? type;
  }
  typeSeverity(type: ClaimType): TagSeverity {
    return CLAIM_TYPE_SEVERITY[type] ?? 'secondary';
  }
}
