import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService extends BaseService<Brand> {
  protected readonly endpoint = 'brands';
}
