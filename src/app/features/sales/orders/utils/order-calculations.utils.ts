import {
  Order,
  OrderItem,
  OrderRefund,
  OrderStatusHistory,
} from '../models/order.model';
import { OrderClaim } from '../models/order-claim.model';
import { ClaimType, OrderStatus } from '../models/orders.enum';
import { ORDER_STATUS_LABELS } from '../models/order.model';
import { Severity, TagSeverity } from '@shared/types/severity.type';

// ═════════════════════════════════════════════════════════════
// MAPAS DE CONSTANTES
// ═════════════════════════════════════════════════════════════

import {
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_SEVERITY,
  CLAIM_TYPE_LABELS,
  REASON_CATEGORY_LABELS,
  REFUND_METHOD_LABELS,
  REFUND_STATUS_LABELS,
  RETURNED_PRODUCT_CONDITION_LABELS,
} from '../models/order-claim.model';

// ═════════════════════════════════════════════════════════════
// MAPAS DE CONSTANTES (DEPRECATED - USAR HELPERS)
// ═════════════════════════════════════════════════════════════

export const CLAIM_TYPE_LABELS_MAP = CLAIM_TYPE_LABELS;
export const CLAIM_TYPE_SEVERITY_MAP: Record<string, TagSeverity> = {
  CANCELLATION: 'danger',
  REFUND: 'warn',
  REPLACEMENT: 'info',
};

export const CLAIM_STATUS_LABELS_MAP = CLAIM_STATUS_LABELS;
export const CLAIM_STATUS_SEVERITY_MAP = CLAIM_STATUS_SEVERITY;

// ═════════════════════════════════════════════════════════════
// TIPOS PARA ITEMS ENRIQUECIDOS
// ═════════════════════════════════════════════════════════════

export interface EnrichedOrderItem extends OrderItem {
  originalQuantity: number;
  effectiveQuantity: number;
  originalLineTotal: number;
  effectiveLineTotal: number;
  isModified: boolean;
  isTotalModified: boolean;
  claimBadges: ClaimBadge[];
  claimDetails: ClaimDetail[];
}

export interface ClaimBadge {
  claimNumber: string;
  label: string;
  severity: TagSeverity;
  tooltip: string;
  qty: number;
  icon: string;
}

export interface ClaimDetail {
  claimNumber: string;
  type: string;
  typeLabel: string;
  typeSeverity: TagSeverity;
  statusLabel: string;
  statusSeverity: TagSeverity;
  quantity: number;
  amount: number;
  createdAt: string;
}

export interface OrderAction {
  label: string;
  icon: string;
  severity: TagSeverity;
  action: string;
  loading?: boolean;
}

// ═════════════════════════════════════════════════════════════
// CLAIMS - FILTROS Y CONSULTAS
// ═════════════════════════════════════════════════════════════

/** Obtiene solo los claims ACTIVOS (APPROVED, COMPLETED, RECEIVED) */
export function getActiveClaims(claims: OrderClaim[]): OrderClaim[] {
  return claims.filter(
    (c) =>
      c.status === 'APPROVED' ||
      c.status === 'COMPLETED' ||
      c.status === 'RECEIVED',
  );
}

/** Obtiene la cantidad reclamada de un item por tipo específico */
export function getClaimedQuantity(
  claims: OrderClaim[],
  itemId: string,
  type?: ClaimType,
): number {
  return claims
    .filter(
      (c) =>
        !['REJECTED', 'CANCELLED'].includes(c.status) &&
        (!type || c.type === type),
    )
    .flatMap((c) => c.items ?? [])
    .filter((ci) => ci.orderItemId === itemId)
    .reduce((sum, ci) => sum + ci.quantity, 0);
}

/** Cantidad cancelada */
export function getCancelledQuantity(
  claims: OrderClaim[],
  itemId: string,
): number {
  return getClaimedQuantity(claims, itemId, 'CANCELLATION');
}

/** Cantidad reembolsada/devuelta */
export function getRefundedQuantity(
  claims: OrderClaim[],
  itemId: string,
): number {
  return getClaimedQuantity(claims, itemId, 'REFUND');
}

/** Cantidad reemplazada */
export function getReplacedQuantity(
  claims: OrderClaim[],
  itemId: string,
): number {
  return getActiveClaims(claims)
    .filter((c) => c.type === 'REPLACEMENT')
    .flatMap((c) => c.items ?? [])
    .filter((ci) => ci.orderItemId === itemId)
    .reduce((sum, ci) => sum + ci.quantity, 0);
}

/** Cantidad que afecta al total (cancelaciones + devoluciones, NO reemplazos) */
export function getQuantityAffectingTotal(
  claims: OrderClaim[],
  itemId: string,
): number {
  return getActiveClaims(claims)
    .filter((c) => c.type !== 'REPLACEMENT')
    .flatMap((c) => c.items ?? [])
    .filter((ci) => ci.orderItemId === itemId)
    .reduce((sum, ci) => sum + ci.quantity, 0);
}

// ═════════════════════════════════════════════════════════════
// CLAIMS - BADGES Y DETALLES PARA LA UI
// ═════════════════════════════════════════════════════════════

const CLAIM_TYPE_ICONS: Record<string, string> = {
  CANCELLATION: 'pi pi-times-circle',
  REFUND: 'pi pi-replay',
  REPLACEMENT: 'pi pi-refresh',
};

/** Obtiene los badges de reclamos para un item */
export function getItemClaimBadges(
  claims: OrderClaim[],
  itemId: string,
): ClaimBadge[] {
  // Agrupar por tipo para sumar cantidades
  const grouped = new Map<
    string,
    { qty: number; claimNumbers: string[]; status: string }
  >();

  getActiveClaims(claims)
    .filter((c) => c.items?.some((ci) => ci.orderItemId === itemId))
    .forEach((claim) => {
      const claimItem = claim.items!.find((ci) => ci.orderItemId === itemId)!;
      const existing = grouped.get(claim.type);
      if (existing) {
        existing.qty += claimItem.quantity;
        existing.claimNumbers.push(claim.claimNumber);
      } else {
        grouped.set(claim.type, {
          qty: claimItem.quantity,
          claimNumbers: [claim.claimNumber],
          status: claim.status,
        });
      }
    });

  return Array.from(grouped.entries()).map(([type, data]) => ({
    claimNumber: data.claimNumbers.join(', '),
    label: CLAIM_TYPE_LABELS_MAP[type] || type,
    severity: (CLAIM_TYPE_SEVERITY_MAP[type] || 'secondary') as TagSeverity,
    tooltip: `${CLAIM_TYPE_LABELS_MAP[type]}: ${data.qty} unidad(es)`,
    qty: data.qty,
    icon: CLAIM_TYPE_ICONS[type] || 'pi pi-info-circle',
  }));
}

/** Obtiene los detalles de reclamos para las filas expandibles de la tabla */
export function getItemClaimDetailsForTable(
  claims: OrderClaim[],
  item: OrderItem,
): ClaimDetail[] {
  const unitPrice =
    Number(item.unitPrice) -
    Number(item.discountAmount) / Math.max(1, Number(item.quantity));

  return getActiveClaims(claims)
    .filter((c) => c.items?.some((ci) => ci.orderItemId === item.id))
    .map((claim) => {
      const claimItem = claim.items!.find((ci) => ci.orderItemId === item.id)!;
      return {
        claimNumber: claim.claimNumber,
        type: claim.type,
        typeLabel: CLAIM_TYPE_LABELS_MAP[claim.type] || claim.type,
        typeSeverity: CLAIM_TYPE_SEVERITY_MAP[claim.type] || 'secondary',
        statusLabel: CLAIM_STATUS_LABELS_MAP[claim.status] || claim.status,
        statusSeverity: CLAIM_STATUS_SEVERITY_MAP[claim.status] || 'secondary',
        quantity: claimItem.quantity,
        amount:
          claim.type !== 'REPLACEMENT'
            ? Number((claimItem.quantity * unitPrice).toFixed(2))
            : 0,
        createdAt: claim.createdAt,
      };
    });
}

// ═════════════════════════════════════════════════════════════
// CÁLCULOS DE CANTIDADES Y PRECIOS
// ═════════════════════════════════════════════════════════════

/** Cantidad efectiva después de reclamos */
export function getEffectiveQuantity(
  claims: OrderClaim[],
  item: OrderItem,
): number {
  const totalClaimed = getActiveClaims(claims)
    .flatMap((c) => c.items ?? [])
    .filter((ci) => ci.orderItemId === item.id)
    .reduce((sum, ci) => sum + ci.quantity, 0);
  return Math.max(0, item.quantity - totalClaimed);
}

/** Total de línea efectivo (descuenta cancelaciones y devoluciones, NO reemplazos) */
export function getEffectiveLineTotal(
  claims: OrderClaim[],
  item: OrderItem,
): number {
  const qtyAffecting = getQuantityAffectingTotal(claims, item.id);
  const effective = item.quantity - qtyAffecting;
  if (effective === item.quantity) return Number(item.lineTotal);
  const unitNet =
    Number(item.unitPrice) -
    Number(item.discountAmount) / Math.max(1, Number(item.quantity));
  return Number((effective * unitNet).toFixed(2));
}

// ═════════════════════════════════════════════════════════════
// CÁLCULOS FINANCIEROS
// ═════════════════════════════════════════════════════════════

/** Total ya reembolsado de la orden */
export function getTotalAlreadyRefunded(order: Order): number {
  return (order.refunds ?? [])
    .filter((r) => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + Number(r.totalRefunded || r.amount), 0);
}

/** Total pendiente por reembolsar */
export function getTotalPendingRefund(order: Order): number {
  return (order.refunds ?? [])
    .filter((r) => r.status === 'PENDING' || r.status === 'PROCESSING')
    .reduce((sum, r) => sum + Number(r.totalRefunded || r.amount), 0);
}

/** Total ajustado (original - reembolsado) */
export function getAdjustedTotal(order: Order): number {
  return Number(order.total) - getTotalAlreadyRefunded(order);
}

/** Costo total de productos vendidos */
export function getCostOfGoods(order: Order): number {
  return (order.items ?? []).reduce(
    (sum, item) => sum + Number(item.unitCost ?? 0) * item.quantity,
    0,
  );
}

/** Costos de envío totales */
export function getTotalShippingCost(order: Order): number {
  return (
    Number(order.logistics?.actualShippingCost ?? 0) +
    Number(order.logistics?.internalTransportCost ?? 0)
  );
}

/** Reembolsos extras por responsabilidad de tienda */
export function getExtraRefunds(order: Order): number {
  return (order.claims ?? [])
    .filter(
      (c) =>
        c.reasonCategory === 'STORE_ERROR' ||
        c.reasonCategory === 'PRODUCT_FAULT',
    )
    .reduce((sum, c) => sum + Number(c.customerVoucherAmount ?? 0), 0);
}

/** Ganancia neta del pedido */
export function getNetProfit(order: Order): number {
  return (
    Number(order.total) -
    getCostOfGoods(order) -
    getTotalShippingCost(order) -
    getExtraRefunds(order)
  );
}

/** Margen de ganancia porcentual */
export function getProfitMargin(order: Order): number {
  const profit = getNetProfit(order);
  const total = Number(order.total);
  return total > 0 ? Number(((profit / total) * 100).toFixed(2)) : 0;
}

// ═════════════════════════════════════════════════════════════
// ESTADO Y TRANSICIONES
// ═════════════════════════════════════════════════════════════

export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getStatusSeverity(status: OrderStatus): TagSeverity {
  const map: Record<OrderStatus, TagSeverity> = {
    pending_payment: 'warn',
    paid: 'success',
    processing: 'info',
    shipped: 'secondary',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'secondary',
  };
  return map[status] ?? 'secondary';
}

export function hasPendingRefund(order: Order): boolean {
  // Legacy support for pending refunds created directly
  const hasLegacyPendingRefund =
    order.refunds?.some(
      (r) => r.status === 'PENDING' || r.status === 'PROCESSING',
    ) ?? false;

  // New flow: A claim ready to be refunded
  const isPaid = !['pending_payment', 'cancelled'].includes(order.status);
  const hasClaimReadyForRefund = (order.claims ?? []).some(
    (c) =>
      (c.status === 'RECEIVED' && c.type === 'REFUND') ||
      (c.status === 'APPROVED' &&
        c.type === 'CANCELLATION' &&
        isPaid &&
        !!c.refundMethod),
  );

  return hasLegacyPendingRefund || hasClaimReadyForRefund;
}

export function canCreateClaim(status: OrderStatus): boolean {
  return ['paid', 'processing', 'delivered', 'pending_payment'].includes(
    status,
  );
}

export function canManageClaims(status: OrderStatus): boolean {
  return ['pending_payment', 'paid', 'processing', 'delivered'].includes(
    status,
  );
}

export function canManageLogistics(status: OrderStatus): boolean {
  return ['processing', 'shipped', 'delivered'].includes(status);
}

export function getOrderProgress(status: OrderStatus): number {
  const progress: Record<OrderStatus, number> = {
    pending_payment: 0,
    paid: 20,
    processing: 40,
    shipped: 60,
    delivered: 100,
    cancelled: 100,
    refunded: 100,
  };
  return progress[status] ?? 0;
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return ['delivered', 'cancelled', 'refunded'].includes(status);
}

// ═════════════════════════════════════════════════════════════
// TIMELINE Y EVENTOS
// ═════════════════════════════════════════════════════════════

export function getTimelineColor(event: OrderStatusHistory): string {
  if (event.fromStatus === event.toStatus) return '#64748b';
  const colors: Record<string, string> = {
    pending_payment: '#f59e0b',
    paid: '#22c55e',
    processing: '#3b82f6',
    shipped: '#6366f1',
    delivered: '#10b981',
    cancelled: '#ef4444',
    refunded: '#ef4444',
  };
  return colors[event.toStatus] ?? '#94a3b8';
}

// ═════════════════════════════════════════════════════════════
// MAPPERS DE LABEL
// ═════════════════════════════════════════════════════════════

export function getClaimTypeLabel(type: string): string {
  return CLAIM_TYPE_LABELS[type as any] ?? type;
}

export function getClaimStatusLabel(status: string): string {
  return CLAIM_STATUS_LABELS[status as any] ?? status;
}

export function getReasonCategoryLabel(category?: string): string {
  if (!category) return 'No especificado';
  return REASON_CATEGORY_LABELS[category as any] ?? category;
}

export function getRefundMethodLabel(method?: string): string {
  if (!method) return 'No especificado';
  return REFUND_METHOD_LABELS[method as any] ?? method;
}

export function getReturnedConditionLabel(condition?: string): string {
  if (!condition) return 'No evaluado';
  return RETURNED_PRODUCT_CONDITION_LABELS[condition as any] ?? condition;
}

export function getTimelineLabel(event: OrderStatusHistory): string {
  if (event.fromStatus === event.toStatus) {
    const comment = event.comment?.toLowerCase() ?? '';

    if (
      comment.includes('reembolso total') ||
      comment.includes('reembolso parcial')
    )
      return 'Reembolso realizado';

    if (comment.includes('cancelación parcial')) return 'Cancelación parcial';
    if (comment.includes('cancelación total')) return 'Cancelación total';

    // Devoluciones y Retornos
    if (
      comment.includes('envío') &&
      (comment.includes('devolución') || comment.includes('retorno'))
    )
      return 'Envío de devolución';
    if (
      (comment.includes('devolución') ||
        comment.includes('retorno') ||
        comment.includes('devuelto')) &&
      (comment.includes('recibida') || comment.includes('recibido'))
    )
      return 'Devolución recibida';
    if (comment.includes('devolución') && comment.includes('aprobada'))
      return 'Devolución aprobada';
    if (comment.includes('devolución')) return 'Devolución registrada';

    if (comment.includes('reclamo')) return 'Reclamo creado';
    if (comment.includes('reembolso')) return 'Reembolso procesado';
    if (comment.includes('reemplazo')) return 'Reemplazo generado';
    if (comment.includes('envío')) return 'Envío confirmado';

    return `${getStatusLabel(event.toStatus)} (actualización)`;
  }
  return getStatusLabel(event.toStatus);
}

export function getTimelineSeverity(event: OrderStatusHistory): TagSeverity {
  if (event.fromStatus === event.toStatus) return 'contrast';
  return getStatusSeverity(event.toStatus);
}

export function hasTimelineDetails(event: OrderStatusHistory): boolean {
  const status = event.toStatus?.toLowerCase();
  return (
    status === 'shipped' ||
    status === 'delivered' ||
    status === 'paid' ||
    event.fromStatus === event.toStatus
  );
}

export function getTimelineDetailType(
  event: OrderStatusHistory,
): 'LOGISTICS' | 'CLAIM' | 'PAYMENT' | null {
  if (event.fromStatus === event.toStatus) return 'CLAIM';
  if (
    (event.toStatus === 'shipped' || event.toStatus === 'delivered') &&
    event.fromStatus !== event.toStatus
  )
    return 'LOGISTICS';
  if (event.toStatus === 'paid' && event.fromStatus !== 'paid')
    return 'PAYMENT';
  return null;
}

// ═════════════════════════════════════════════════════════════
// IMÁGENES Y EVIDENCIA
// ═════════════════════════════════════════════════════════════

export function getLogisticsImages(
  logistics: Order['logistics'],
  event: OrderStatusHistory,
): Array<{ url: string; imageRole: string }> {
  if (!logistics) return [];
  const allImages = logistics.images ?? [];
  const role =
    event.toStatus === 'shipped' ? 'shipping_evidence' : 'delivery_evidence';
  const filteredImages = allImages
    .filter((img: any) => img.imageRole === role)
    .map((img: any) => ({ url: img.url || '', imageRole: role }))
    .filter((img) => img.url);
  if (event.toStatus === 'delivered' && logistics.deliveryPhotoUrl) {
    const alreadyIncluded = filteredImages.some(
      (img) => img.url === logistics.deliveryPhotoUrl,
    );
    if (!alreadyIncluded) {
      filteredImages.unshift({
        url: logistics.deliveryPhotoUrl,
        imageRole: 'delivery_evidence',
      });
    }
  }
  return filteredImages;
}

// export function getClaimImagesByEvent(
//   claims: OrderClaim[],
//   event: OrderStatusHistory,
// ): Array<{ url: string; id?: string }> {
//   if (event.fromStatus !== event.toStatus) return [];
//   const comment = event.comment?.toLowerCase() ?? '';
//   const claim = claims.find((c) =>
//     comment.includes(c.claimNumber.toLowerCase()),
//   );
//   if (!claim?.images) return [];
//   return claim.images
//     .filter((img) => img.url)
//     .map((img) => ({ url: img.url as string, id: img.id }));
// }

/**
 * Obtiene imágenes de reclamo filtradas por tipo de evento.
 * - Envío: imágenes de 'return_evidence'
 * - Recepción: imágenes de 'customer_evidence' (fotos del producto recibido)
 * - Reembolso: imágenes de 'refund_evidence'
 * - Otros: todas las imágenes del claim
 */
export function getClaimImagesByEvent(
  claims: OrderClaim[],
  event: OrderStatusHistory,
): Array<{ url: string; id?: string }> {
  if (event.fromStatus !== event.toStatus) return [];

  const comment = event.comment?.toLowerCase() ?? '';
  const claim = claims.find((c) =>
    comment.includes(c.claimNumber.toLowerCase()),
  );

  if (!claim?.images?.length || comment.includes('reembolso')) return [];

  if (
    comment.includes('envío') ||
    comment.includes('tracking') ||
    comment.includes('courier')
  ) {
    return claim.images
      .filter(
        (img) =>
          img.imageRole === 'return_evidence' ||
          img.imageRole === 'return_shipment',
      )
      .map((img) => ({ url: img.url as string, id: img.id }));
  }

  if (comment.includes('recibido') || comment.includes('recibida')) {
    return claim.images
      .filter((img) => img.imageRole === 'customer_evidence')
      .map((img) => ({ url: img.url as string, id: img.id }));
  }

  // Default: todas las imágenes
  return claim.images.map((img) => ({ url: img.url as string, id: img.id }));
}

export function getRefundImagesByEvent(
  refunds: OrderRefund[],
  claims: OrderClaim[],
  event: OrderStatusHistory,
): Array<{ url: string; id?: string }> {
  const comment = event.comment?.toLowerCase() ?? '';
  const claim = claims.find((c) =>
    comment.includes(c.claimNumber.toLowerCase()),
  );

  const refund = refunds.find(
    (r) => r.claimId === claim?.id && comment.includes('reembolso'),
  );

  console.log('Refund', refund);
  console.log('Claim', claim);

  if (!refund?.images?.length) return [];

  // Default: todas las imágenes
  return refund.images.map((img) => ({ url: img.url as string, id: img.id }));
}

export function getClaimByEvent(
  claims: OrderClaim[],
  event: OrderStatusHistory,
): OrderClaim | null {
  if (event.fromStatus !== event.toStatus) return null;
  const comment = event.comment?.toLowerCase() ?? '';
  return (
    claims.find((c) => comment.includes(c.claimNumber.toLowerCase())) ?? null
  );
}

// ═════════════════════════════════════════════════════════════
// CLIENTE, DIRECCIÓN, PAGO
// ═════════════════════════════════════════════════════════════

export function getCustomerName(order: Order): string {
  if (order.customer?.firstName && order.customer?.lastName) {
    return `${order.customer.firstName} ${order.customer.lastName}`;
  }
  return order.guestName ?? order.guestEmail ?? 'Cliente Invitado';
}

export function getCustomerEmail(order: Order): string | undefined {
  return order.customer?.email ?? order.guestEmail;
}

export function getFullAddress(address: Order['shippingAddress']): string {
  if (!address) return '';
  const parts = [
    address.addressLine,
    address.district?.name,
    address.province?.name,
    address.department?.name,
  ].filter(Boolean);
  return parts.join(', ');
}

export function isManualPayment(order: Order): boolean {
  const type = order.paymentMethod?.type;
  return type === 'wallet' || type === 'cash_code' || type === 'bank_transfer';
}

export function isCashOnDelivery(order: Order): boolean {
  return (
    order.paymentMethod?.type === 'cash_on_delivery' ||
    order.paymentMethod?.code === 'cash_on_delivery'
  );
}

export function isCardPayment(order: Order): boolean {
  return order.paymentMethod?.type === 'card';
}

// ═════════════════════════════════════════════════════════════
// CLAIMS - VERIFICACIONES DE ESTADO
// ═════════════════════════════════════════════════════════════

export function claimNeedsReturnShipment(claim: OrderClaim): boolean {
  return (
    claim.status === 'APPROVED' &&
    !claim.returnShipmentConfirmedAt &&
    (claim.type === 'REFUND' || claim.type === 'REPLACEMENT')
  );
}

export function claimReadyForReception(claim: OrderClaim): boolean {
  return claim.status === 'APPROVED' && !!claim.returnShipmentConfirmedAt;
}

export function claimReadyForRefund(claim: OrderClaim, order?: Order): boolean {
  if (claim.status === 'RECEIVED' && claim.type === 'REFUND') return true;

  if (
    claim.status === 'APPROVED' &&
    claim.type === 'CANCELLATION' &&
    !!claim.refundMethod
  ) {
    if (order) {
      return !['pending_payment', 'cancelled'].includes(order.status);
    }
    return true; // Si no hay orden en el contexto, asumimos optimismo (normalmente hay orden pagada)
  }

  return false;
}

export function claimReadyForReplacement(claim: OrderClaim): boolean {
  return claim.status === 'RECEIVED' && claim.type === 'REPLACEMENT';
}

// ═════════════════════════════════════════════════════════════
// ACCIONES DISPONIBLES
// ═════════════════════════════════════════════════════════════

export function getAvailableActions(order: Order): OrderAction[] {
  const actions: OrderAction[] = [];

  switch (order.status) {
    case 'pending_payment':
      if (isManualPayment(order)) {
        actions.push({
          label: 'Confirmar pago',
          icon: 'pi pi-check-circle',
          severity: 'success',
          action: 'confirm-payment',
        });
      }
      if (isCashOnDelivery(order)) {
        actions.push({
          label: 'Preparar pedido',
          icon: 'pi pi-box',
          severity: 'warn',
          action: 'mark-processing',
        });
      }
      break;
    case 'paid':
      actions.push({
        label: 'Preparar pedido',
        icon: 'pi pi-box',
        severity: 'warn',
        action: 'mark-processing',
      });
      break;
    case 'processing':
      actions.push({
        label: 'Enviar pedido',
        icon: 'pi pi-truck',
        severity: 'info',
        action: 'ship-order',
      });
      break;
    case 'shipped':
      actions.push({
        label: 'Confirmar entrega',
        icon: 'pi pi-check',
        severity: 'success',
        action: 'deliver-order',
      });
      actions.push({
        label: 'Editar logística',
        icon: 'pi pi-pencil',
        severity: 'secondary',
        action: 'ship-order',
      });
      break;
    case 'cancelled':
      if (hasPendingRefund(order)) {
        actions.push({
          label: 'Procesar reembolso',
          icon: 'pi pi-money-bill',
          severity: 'warn',
          action: 'complete-refund',
        });
      }
      break;
  }

  if (canCreateClaim(order.status)) {
    actions.push({
      label: order.status === 'delivered' ? 'Nuevo reclamo' : 'Cancelar pedido',
      icon: 'pi pi-exclamation-circle',
      severity: 'secondary',
      action: order.status === 'delivered' ? 'create-claim' : 'cancel-order',
    });
  }

  return actions;
}

/**
 * Obtiene las acciones disponibles para un claim
 * según su estado y tipo
 */
export function getClaimActions(claim: OrderClaim): Array<{
  type: string;
  icon: string;
  tooltip: string;
  severity: Severity;
}> {
  const actions: Array<{
    type: string;
    icon: string;
    tooltip: string;
    severity: Severity;
  }> = [];

  // Revisar (aprobar/rechazar) - Solo PENDING
  if (claim.status === 'PENDING') {
    actions.push({
      type: 'review',
      icon: 'pi pi-cog',
      tooltip: 'Revisar reclamo',
      severity: 'secondary',
    });
  }

  // Registrar envío de devolución - APPROVED sin envío confirmado
  if (
    claim.status === 'APPROVED' &&
    !claim.returnShipmentConfirmedAt &&
    (claim.type === 'REFUND' || claim.type === 'REPLACEMENT')
  ) {
    actions.push({
      type: 'register-shipment',
      icon: 'pi pi-truck',
      tooltip: 'Registrar envío de devolución',
      severity: 'info',
    });
  }

  // Registrar recepción - APPROVED con envío confirmado
  if (claim.status === 'APPROVED' && !!claim.returnShipmentConfirmedAt) {
    actions.push({
      type: 'mark-received',
      icon: 'pi pi-check-circle',
      tooltip: 'Registrar recepción del producto',
      severity: 'success',
    });
  }

  // Procesar reembolso - RECEIVED + REFUND, o CANCELLATION aprobada en pedido ya pagado
  const isPaid =
    claim.order?.status &&
    !['pending_payment', 'cancelled'].includes(claim.order.status);

  if (
    (claim.status === 'RECEIVED' && claim.type === 'REFUND') ||
    (claim.status === 'APPROVED' &&
      claim.type === 'CANCELLATION' &&
      isPaid &&
      !!claim.refundMethod)
  ) {
    actions.push({
      type: 'complete-refund',
      icon: 'pi pi-money-bill',
      tooltip: 'Procesar reembolso',
      severity: 'primary',
    });
  }

  // Generar reemplazo - RECEIVED + REPLACEMENT
  if (claim.status === 'RECEIVED' && claim.type === 'REPLACEMENT') {
    actions.push({
      type: 'complete-replacement',
      icon: 'pi pi-refresh',
      tooltip: 'Generar orden de reemplazo',
      severity: 'info',
    });
  }

  return actions;
}

// ═════════════════════════════════════════════════════════════
// FORMATO
// ═════════════════════════════════════════════════════════════

export function getProductImageUrl(url?: string, baseUrl: string = ''): string {
  if (!url) return 'assets/images/placeholder.png';
  if (url.startsWith('http')) return url;
  return `${baseUrl}${url}`;
}

/** Obtiene la cantidad total original de unidades en la orden */
export function getTotalOriginalQuantity(order: Order): number {
  return order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
}

/** Obtiene la cantidad total efectiva (activa) de unidades tras reclamos */
export function getTotalEffectiveQuantity(order: Order): number {
  if (!order.items) return 0;
  return order.items.reduce((sum, item) => {
    const affecting = getQuantityAffectingTotal(order.claims ?? [], item.id);
    return sum + Math.max(0, item.quantity - affecting);
  }, 0);
}

/** Obtiene el monto a reembolsar de un reclamo proyectando precios netos */
export function getClaimRefundAmount(claim: OrderClaim): number {
  if (claim.type === 'REPLACEMENT') return 0;

  const itemTotal =
    claim.items?.reduce((sum, ci) => {
      const item = ci.orderItem;
      if (!item) return sum;

      // Calculamos el precio unitario neto (precio - descuento prorrateado)
      const unitNet =
        Number(item.unitPrice) -
        Number(item.discountAmount || 0) /
          Math.max(1, Number(item.quantity || 1));

      return sum + unitNet * ci.quantity;
    }, 0) ?? 0;

  const voucherAmount =
    claim.customerVoucherAmount &&
    Number(claim.customerVoucherAmount) > 0 &&
    claim.reasonCategory !== 'CUSTOMER_DECISION'
      ? Number(claim.customerVoucherAmount)
      : 0;

  return Number((itemTotal + voucherAmount).toFixed(2));
}

export function isValidOrder(order: Order | null): order is Order {
  return !!order && !!order.id && !!order.orderNumber;
}

/** Formatea un monto en soles peruanos con símbolo */
export function formatCurrency(amount: number): string {
  return `S/ ${amount.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
