import { BaseModel } from '@core/models/base.model';
import { CustomerAddress } from './customer-address.model';

export interface Customer extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  lastLoginAt?: string | Date | null;
  emailVerifiedAt?: string | Date | null;
  googleId?: string | null;
  passwordHash?: string | null;

  // Relaciones
  addresses?: CustomerAddress[];
}
