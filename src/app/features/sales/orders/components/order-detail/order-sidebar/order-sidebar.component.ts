import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Order } from '../../../models/order.model';
import {
  DELIVERY_TYPE_LABELS,
  OrderLogistics,
} from '../../../models/order-logistics.model';
import * as OrderUtils from '../../../utils/order-calculations.utils';

@Component({
  selector: 'app-order-sidebar',
  imports: [CurrencyPipe, DatePipe, ButtonModule, TooltipModule],
  templateUrl: './order-sidebar.component.html',
})
export class OrderSidebarComponent {
  readonly order = input.required<Order>();
  readonly logistics = input<OrderLogistics | null>(null);

  readonly navigateToCustomer = output<string>();

  protected readonly DELIVERY_TYPE_LABELS = DELIVERY_TYPE_LABELS;

  protected getCustomerName(): string {
    return OrderUtils.getCustomerName(this.order());
  }

  protected getCustomerEmail(): string | undefined {
    return OrderUtils.getCustomerEmail(this.order());
  }
}
