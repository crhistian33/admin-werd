import { TagSeverity } from '@shared/types/severity.type';
import {
  ClaimStatus,
  ClaimType,
  ReasonCategory,
  RefundMethod,
  ReturnedProductCondition,
  ReviewClaimType,
} from './orders.enum';
import { ImageRecord } from '@shared/images/interfaces/image.interface';

// ── Display labels ────────────────────────────────────────────

export const CLAIM_TYPE_LABELS: Record<string, string> = {
  CANCELLATION: 'Cancelación',
  REFUND: 'Devolución',
  REPLACEMENT: 'Reemplazo',
};

export const CLAIM_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Abierta',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  RECEIVED: 'Recibida',
  COMPLETED: 'Completada',
  CANCELLED: 'Anulada',
};

export const CLAIM_STATUS_SEVERITY: Record<ClaimStatus, TagSeverity> = {
  PENDING: 'warn',
  APPROVED: 'success',
  REJECTED: 'danger',
  RECEIVED: 'info',
  COMPLETED: 'contrast',
  CANCELLED: 'secondary',
};

export const REASON_CATEGORY_LABELS: Record<string, string> = {
  CUSTOMER_DECISION: 'Decisión del cliente',
  STORE_ERROR: 'Error de la tienda / logística',
  PRODUCT_FAULT: 'Falla técnica del producto',
};

export const RETURNED_PRODUCT_CONDITION_LABELS: Record<string, string> = {
  RESELLABLE: 'Buen estado (Revendible)',
  DAMAGED: 'Dañado (No apto para venta)',
  DESTROYED: 'Destruido (Baja total)',
};

export const REFUND_METHOD_LABELS: Record<string, string> = {
  CARD: 'Extorno a tarjeta (Culqi/Pasarela)',
  WALLET: 'Billetera Digital (Yape / Plin)',
  STORE_CREDIT: 'Crédito en tienda (Cupón)',
  BANK_TRANSFER: 'Transferencia bancaria',
  CASH: 'Efectivo / Contra-entrega',
};

export const REFUND_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Ejecutado',
  FAILED: 'Fallido',
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
  adminNotes?: string;
  receivedProductCondition?: ReturnedProductCondition;
  internalDamageNote?: string;
  createdAt: string;
  reviewedAt?: string;
  receivedAt?: string;
  completedAt?: string;
  customer?: { firstName: string; lastName: string; email: string };
  order?: { orderNumber: string; status: string };
  items?: OrderClaimItem[];
  images?: ImageRecord[];
  returnShipmentConfirmedAt?: string;
  refundMethod?: RefundMethod; // CARD_REFUND | DIGITAL_WALLET | BANK_TRANSFER | STORE_CREDIT
  refundAccountDetails?: string;
}

export interface OrderClaimItem {
  id: string;
  orderItemId: string;
  quantity: number;
  orderItem?: {
    productName: string;
    productSku: string;
    productImageUrl?: string;
    unitPrice: number;
    discountAmount: number;
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
  items: { orderItemId: string; quantity: number }[];
  adminNotes?: string;
  autoApprove?: boolean;
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

export interface ConfirmReturnShipmentPayload {
  courierName: string;
  trackingNumber: string;
  customerVoucherAmount?: number;
  tempImageIds?: string[];
  notes?: string;
  refundMethod?: string;
  refundAccountDetails?: string;
}
