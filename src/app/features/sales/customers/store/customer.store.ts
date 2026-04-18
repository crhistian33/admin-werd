import { inject, Injectable, signal } from '@angular/core';
import { BaseStore } from '@core/store/base.store';
import { CustomersService } from '../services/customers.service';
import { Customer } from '../models/customer.model';
import {
  CustomerFilter,
  customerFilterDefaults,
} from '../models/customer-filter.model';

@Injectable({ providedIn: 'root' })
export class CustomerStore extends BaseStore<Customer, CustomerFilter> {
  protected override readonly service = inject(CustomersService);

  override readonly filter = signal<CustomerFilter>(customerFilterDefaults());

  constructor() {
    super({ useSoftDelete: true });
  }
}
