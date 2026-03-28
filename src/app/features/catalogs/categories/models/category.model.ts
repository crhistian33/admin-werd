import { BaseModel } from '@core/models/base.model';
import { ImageRecord } from '@shared/images/interfaces/image.interface';

export interface CategoryCount {
  products: number;
}

export interface Category extends BaseModel {
  name: string;
  description: string;
  images: ImageRecord[];
  isActive: boolean;
  slug?: string;
  parentId?: string | null;
  sortOrder?: number;
  deletedAt?: string | null;
  parent?: Category | null;
  children?: Category[];
  _count?: CategoryCount;
}
