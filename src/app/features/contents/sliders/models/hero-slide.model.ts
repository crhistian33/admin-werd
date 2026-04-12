import { BaseModel } from '@core/models/base.model';
import { ImageRecord } from '@shared/images/interfaces/image.interface';

export type LinkType = 'product' | 'category' | 'external' | 'none';

export interface HeroSlide extends BaseModel {
  title: string;
  subtitle: string;
  linkType: LinkType;
  linkProductId?: string;
  linkCategoryId?: string;
  linkUrl?: string;
  linkText?: string;
  sortOrder: number;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  images?: ImageRecord[];
  deletedAt?: string;
}
