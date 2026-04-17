import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { RolesService } from '../services/roles.service';
import { Role } from '../models/role.model';
import { RoleFilter, roleFilterDefaults } from '../models/role-filter.model';

@Injectable({ providedIn: 'root' })
export class RoleStore extends BaseStore<Role, RoleFilter> {
  protected readonly service = inject(RolesService);

  override readonly filter = signal<RoleFilter>(roleFilterDefaults());

  constructor() {
    super({ useSoftDelete: false });
  }
}
