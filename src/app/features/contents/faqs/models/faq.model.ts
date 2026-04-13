import { BaseModel } from '@core/models/base.model';

export interface Faq extends BaseModel {
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
  isActive: boolean;
}
