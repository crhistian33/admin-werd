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

export interface CancelOrderPayload {
  reason: string;
  adminNotes?: string;
}

export interface ShipOrderPayload {
  deliveryType: DeliveryType;
  courierName?: string;
  trackingNumber?: string;
  actualShippingCost?: number;
  internalTransportCost?: number;
  tempImageIds?: string[];
  internalNotes?: string;
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
