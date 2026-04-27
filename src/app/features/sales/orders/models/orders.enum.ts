export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type DeliveryType = 'COURIER' | 'LOCAL_MOTORIZED';

export type ReasonCategory =
  | 'CUSTOMER_DECISION'
  | 'STORE_ERROR'
  | 'PRODUCT_FAULT';

export type ReviewClaimType = 'APPROVED' | 'REJECTED';

export type ClaimType = 'CANCELLATION' | 'REFUND' | 'REPLACEMENT';

export type ClaimReasonCategory =
  | 'CUSTOMER_DECISION'
  | 'STORE_ERROR'
  | 'PRODUCT_FAULT';

export type ClaimStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type RefundStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type RefundMethod =
  | 'ORIGINAL_PAYMENT_METHOD'
  | 'STORE_CREDIT'
  | 'BANK_TRANSFER';

export type ReturnedProductCondition = 'RESELLABLE' | 'DAMAGED' | 'DESTROYED';
