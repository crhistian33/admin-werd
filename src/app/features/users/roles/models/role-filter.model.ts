import { BaseFilter } from '@shared/models/base-filter.model';

export interface RoleFilter extends BaseFilter {}

export const roleFilterDefaults = (): RoleFilter => ({
  page: 1,
  limit: 10,
  search: '',
});
