import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-profitability',
  imports: [CurrencyPipe],
  templateUrl: './order-profitability.component.html',
})
export class OrderProfitabilityComponent {
  readonly netProfit = input.required<number>();
  readonly profitMargin = input<number>();
}
