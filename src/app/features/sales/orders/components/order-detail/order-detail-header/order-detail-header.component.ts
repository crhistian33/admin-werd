import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Order } from '../../../models/order.model';
import { TagSeverity } from '@shared/types/severity.type';

@Component({
  selector: 'app-order-detail-header',
  imports: [DatePipe, ButtonModule, TagModule],
  templateUrl: './order-detail-header.component.html',
  styleUrl: './order-detail-header.component.scss',
})
export class OrderDetailHeaderComponent {
  readonly order = input.required<Order>();
  readonly parentOrder = input<string>();
  readonly actions = input.required<
    Array<{
      label: string;
      icon: string;
      severity: TagSeverity;
      action: () => void;
      loading?: boolean;
    }>
  >();
  readonly statusLabel = input.required<string>();
  readonly statusSeverity = input.required<TagSeverity>();

  readonly back = output<void>();
}
