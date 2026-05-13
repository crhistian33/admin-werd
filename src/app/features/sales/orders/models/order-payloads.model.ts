import { DeliveryType, OrderStatus, RefundMethod } from './orders.enum';

export interface UpdateOrderStatusPayload {
  status?: OrderStatus;
  adminNotes?: string;
  statusComment?: string;
}

export interface RefundItemPayload {
  orderItemId: string;
  quantity: number;
}

export interface CreateRefundPayload {
  reason: string;
  items: RefundItemPayload[];
}

export interface ConfirmPaymentPayload {
  operationNumber: string;
  paidAmount: number;
  adminNotes?: string;
}

export interface SelectedOrderItem {
  orderItemId: string;
  quantity: number;
}

export interface CancelOrderPayload {
  reason:
    | 'customer_request'
    | 'no_payment'
    | 'no_stock'
    | 'fraud'
    | 'wrong_address'
    | 'damaged_in_warehouse'
    | 'other';
  reasonDetail?: string;
  adminNotes?: string;
  isFullCancellation?: boolean;
  autoApprove?: boolean;
  items?: SelectedOrderItem[];
  refundMethod?: string;
  refundAccountDetails?: string;
}

export interface ShipOrderPayload {
  deliveryType: DeliveryType;
  courierName?: string;
  trackingNumber?: string;
  actualShippingCost?: number;
  internalTransportCost?: number;
  tempImageIds?: string[];
}

export interface DeliverOrderPayload {
  deliveryEvidenceNote?: string;
  tempImageIds?: string[];
  cashCollectedAmount?: number;
}

export interface CompleteRefundPayload {
  refundMethod: RefundMethod;
  gatewayRefundId?: string;
  adminNotes?: string;
  tempImageIds?: string[];
}
