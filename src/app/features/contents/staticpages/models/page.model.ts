import { BaseModel } from '@core/models/base.model';

export type PageStatus = 'draft' | 'published';

export interface Page extends BaseModel {
  title: string;
  slug: string;
  content?: string;
  status: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
  deletedAt?: string | null;
}
