import { Component, input } from '@angular/core';

@Component({
  selector: 'app-order-item-quantity',
  templateUrl: './order-item-quantity.component.html',
  styleUrl: './order-item-quantity.component.scss',
})
export class OrderItemQuantityComponent {
  readonly effectiveQuantity = input.required<number>();
  readonly originalQuantity = input.required<number>();
  readonly cancelledQuantity = input.required<number>();
  readonly refundedQuantity = input.required<number>();
  readonly isModified = input.required<boolean>();
}
