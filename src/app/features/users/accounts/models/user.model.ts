import { BaseModel } from '@core/models/base.model';

export interface User extends BaseModel {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}
