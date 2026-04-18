import { Injectable } from '@angular/core';
import { BaseService } from '@core/services/base.service';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService extends BaseService<Customer> {
  protected override readonly endpoint = 'customers';
}
