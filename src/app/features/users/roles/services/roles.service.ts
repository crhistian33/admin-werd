import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/role.model';
import { RoleFilter } from '../models/role-filter.model';
import { BaseService } from '@core/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends BaseService<Role> {
  protected readonly endpoint = 'roles';
}
