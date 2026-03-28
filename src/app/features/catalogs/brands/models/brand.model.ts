import { BaseModel } from '@core/models/base.model';

export interface Brand extends BaseModel {
  name: string;
  image?: string;
}
