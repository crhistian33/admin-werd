import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-item-total',
  imports: [CurrencyPipe],
  templateUrl: './order-item-total.component.html',
  styleUrl: './order-item-total.component.scss',
})
export class OrderItemTotalComponent {
  readonly effectiveTotal = input.required<number>();
  readonly originalTotal = input.required<number>();
  readonly isModified = input.required<boolean>();
}
