import { DeliveryType } from './orders.enum';

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  COURIER: 'Courier / Agencia',
  LOCAL_MOTORIZED: 'Motorizado Local',
};

export interface OrderLogistics {
  id: string;
  orderId: string;
  deliveryType: DeliveryType;
  estimatedShipping: number;
  actualShippingCost?: number;
  internalTransportCost?: number;
  trackingNumber?: string;
  courierName?: string; // ✅ AGREGADO
  dispatchedAt?: string; // ✅ AGREGADO
  dispatchedById?: string; // ✅ AGREGADO
  deliveredAt?: string; // ✅ AGREGADO
  deliveredById?: string; // ✅ AGREGADO
  receivedBy?: string; // ✅ AGREGADO
  deliveryPhotoUrl?: string; // ✅ AGREGADO
  deliveryNotes?: string; // ✅ AGREGADO
  packingPhotoUrl?: string; // Legacy - mantener compatibilidad
  notes?: string; // Legacy - mantener compatibilidad
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLogisticsPayload {
  deliveryType: DeliveryType;
  courierName?: string;
  trackingNumber?: string;
  actualShippingCost?: number;
  internalTransportCost?: number;
  tempImageIds?: string[];
}

export interface CreateLogisticsPayload {
  deliveryType: DeliveryType;
  trackingNumber?: string;
  actualShippingCost?: number;
  internalTransportCost?: number;
  packingPhotoUrl?: string;
  notes?: string;
}
