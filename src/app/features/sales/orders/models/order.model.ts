import { BaseModel } from '@core/models/base.model';
import { Product } from '@features/catalogs/products/models/product.model';
import { Customer } from '@features/sales/customers/models/customer.model';
import { PaymentMethod } from '@features/settings/payment-methods/models/payment-method.model';
import { ShippingZone } from '@features/settings/shipping-zones/models/shipping.model';
import {
  Department,
  District,
  Province,
} from '@features/settings/shipping-zones/models/ubigeo.model';
import { OrderLogistics } from './order-logistics.model';
import { OrderClaim } from './order-claim.model';
import { OrderStatus } from './orders.enum';

// ─────────────────────────────────────────────────────────────
// SUB-MODELOS
// ─────────────────────────────────────────────────────────────

export interface OrderAddress {
  id: string;
  alias?: string;
  recipientName: string;
  phone?: string;
  addressLine: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
  department: Department;
  province: Province;
  district: District;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  unitCost?: number;
  discountAmount: number;
  lineTotal: number;
  promotionId?: string;
  product?: Product;
  promotion?: { id: string; name: string };
  refundItems?: OrderRefundItem[];
}

export interface OrderRefundItem {
  id: string;
  refundId: string;
  orderItemId: string;
  quantity: number;
  amount: number;
}

export interface OrderRefund {
  id: string;
  orderId: string;
  amount: number;
  reason?: string;
  cancellationReason?: string; // ✅ AGREGADO
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  method?: 'ORIGINAL_PAYMENT_METHOD' | 'STORE_CREDIT' | 'BANK_TRANSFER';
  createdAt: string;
  processedAt?: string;
  items?: OrderRefundItem[];
  totalRefunded?: number;
}

export interface OrderPaymentTransaction {
  id: string;
  orderId: string;
  paymentMethodId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  gatewayTransactionId?: string;
  cipCode?: string;
  cipExpiresAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  changedById?: string;
  comment?: string;
  createdAt: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  estimatedMin?: number;
  estimatedMax?: number;
  estimatedUnit?: 'minutes' | 'hours' | 'days';
  zone?: ShippingZone;
}

// ─────────────────────────────────────────────────────────────
// MODELO PRINCIPAL
// ─────────────────────────────────────────────────────────────

export interface Order extends BaseModel {
  orderNumber: string;

  // Cliente o guest
  customerId?: string;
  customer?: Customer;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;

  // Estado
  status: OrderStatus;

  // Totales
  subtotal: number;
  discountAmount: number;
  couponDiscount: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;

  // Relaciones
  couponId?: string;
  coupon?: {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
  };
  paymentMethodId: string;
  paymentMethod?: PaymentMethod;
  shippingRateId?: string;
  shippingRate?: ShippingRate;
  shippingAddress?: OrderAddress;

  // Metadatos
  notes?: string;
  adminNotes?: string;
  ipAddress?: string;

  // Timestamps de ciclo de vida
  placedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  refundedAt?: string;

  // Relaciones completas (en vista de detalle)
  items?: OrderItem[];
  transactions?: OrderPaymentTransaction[];
  statusHistory?: OrderStatusHistory[];
  refunds?: OrderRefund[];

  // Logística y reclamaciones (NUEVO SISTEMA UNIFICADO)
  logistics?: OrderLogistics;
  claims?: OrderClaim[];
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pendiente de pago',
  paid: 'Pagado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

/** Transiciones válidas — espejo de VALID_TRANSITIONS del backend */
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

export const getCustomerName = (order: Order): string => {
  if (order.customer) {
    return `${order.customer.firstName} ${order.customer.lastName}`;
  }
  return order.guestName ?? order.guestEmail ?? 'Guest';
};
