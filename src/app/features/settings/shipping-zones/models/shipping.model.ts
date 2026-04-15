import { BaseModel } from '@core/models/base.model';

type DeliveryUnit = 'days' | 'hours' | 'minutes';

export interface ShippingZone extends BaseModel {
  name: string;
  description?: string;
  isActive: boolean;
  areas: ShippingZoneArea[];
  rates: ShippingRate[];
}

export interface ShippingZoneArea {
  id?: string;
  departmentId: string;
  provinceId?: string;
  districtId?: string;
}

export interface ShippingRate extends BaseModel {
  name: string;
  price: number;
  minOrderAmount?: number;
  freeShippingThreshold?: number;
  isActive: boolean;
  estimatedMin?: number;
  estimatedMax?: number;
  estimatedUnit?: DeliveryUnit;
  sortOrder: number;
}
