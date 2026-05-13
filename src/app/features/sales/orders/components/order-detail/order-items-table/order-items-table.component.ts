import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { OrderStore } from '../../../store/order.store';

@Component({
  selector: 'app-order-items-table',
  standalone: true,
  imports: [CurrencyPipe, NgClass, TableModule, TagModule, TooltipModule],
  templateUrl: './order-items-table.component.html',
})
export class OrderItemsTableComponent {
  readonly store = inject(OrderStore);
  readonly getProductImageUrl = input.required<(url?: string) => string>();
  /** Emitted when the user clicks a claim badge, to scroll to the claims section */
  readonly scrollToClaims = output<void>();
}

