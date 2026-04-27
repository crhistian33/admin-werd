import { TagSeverity } from '@shared/types/tag-severity.type';
import {
  ClaimStatus,
  ClaimType,
  ReasonCategory,
  ReturnedProductCondition,
  ReviewClaimType,
} from './orders.enum';

// ── Display labels ────────────────────────────────────────────

export const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  CANCELLATION: 'Cancelación',
  REFUND: 'Devolución con Reembolso',
  REPLACEMENT: 'Reemplazo',
};

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  RECEIVED: 'Recibida',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export const CLAIM_STATUS_SEVERITY: Record<ClaimStatus, TagSeverity> = {
  PENDING: 'warn',
  APPROVED: 'success',
  REJECTED: 'danger',
  RECEIVED: 'info',
  COMPLETED: 'contrast',
  CANCELLED: 'secondary',
};

export const REASON_CATEGORY_LABELS: Record<ReasonCategory, string> = {
  CUSTOMER_DECISION: 'Decisión del cliente',
  STORE_ERROR: 'Error de la tienda',
  PRODUCT_FAULT: 'Falla del producto',
};

// ── Definición de motivos válidos por tipo ────────────────────

export const VALID_REASONS_BY_TYPE: Record<ClaimType, ReasonCategory[]> = {
  CANCELLATION: ['CUSTOMER_DECISION', 'STORE_ERROR'],
  REFUND: ['CUSTOMER_DECISION', 'STORE_ERROR', 'PRODUCT_FAULT'],
  REPLACEMENT: ['STORE_ERROR', 'PRODUCT_FAULT'],
};

// ─────────────────────────────────────────────────────────────
// MODELO
// ─────────────────────────────────────────────────────────────

export interface OrderClaim {
  id: string;
  claimNumber: string;
  orderId: string;
  customerId: string;
  type: ClaimType;
  status: ClaimStatus;
  reasonCategory: ReasonCategory;
  description?: string;
  customerVoucherAmount?: number;
  reviewNote?: string;
  internalNote?: string;
  receivedProductCondition?: ReturnedProductCondition;
  internalDamageNote?: string;
  createdAt: string;
  reviewedAt?: string;
  receivedAt?: string;
  completedAt?: string;
  customer?: { firstName: string; lastName: string; email: string };
  order?: { orderNumber: string; status: string };
  items?: OrderClaimItem[];
}

export interface OrderClaimItem {
  id: string;
  orderItemId: string;
  quantity: number;
  orderItem?: {
    productName: string;
    productSku: string;
    unitPrice: number;
    quantity: number;
  };
}

// ─────────────────────────────────────────────────────────────
// PAYLOADS
// ─────────────────────────────────────────────────────────────

export interface CreateClaimPayload {
  type: ClaimType;
  reasonCategory: ReasonCategory;
  description?: string;
  customerVoucherAmount?: number;
  tempImageIds?: string[];
  adminNotes?: string;
}

export interface ReviewClaimPayload {
  action: ReviewClaimType;
  reviewNote?: string;
  internalNote?: string;
}

export interface MarkClaimReceivedPayload {
  productCondition: ReturnedProductCondition;
  internalDamageNote?: string;
  adminNote?: string;
}
