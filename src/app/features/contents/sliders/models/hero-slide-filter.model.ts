import { BaseFilter } from '@shared/models/base-filter.model';
import { LinkType } from './hero-slide.model';

export interface HeroSlideFilter extends BaseFilter {
  isActive: boolean | null;
  linkType: LinkType | null;
}

export const heroSlideFilterDefaults = (): HeroSlideFilter => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: null,
  linkType: null,
});
