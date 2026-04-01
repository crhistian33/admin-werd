import { BaseModel } from '@core/models/base.model';
import { ImageRecord } from '@shared/images/interfaces/image.interface';

export interface Brand extends BaseModel {
  name: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
  images?: ImageRecord[];
}
