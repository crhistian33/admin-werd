export interface CustomerAddress {
  id: string;
  customerId: string;
  alias?: string | null;
  recipientName: string;
  phone?: string | null;
  departmentId: string;
  provinceId: string;
  districtId: string;
  addressLine: string;
  reference?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
