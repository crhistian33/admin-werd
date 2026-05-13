import { Component, input, output, signal } from '@angular/core';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Order, OrderStatusHistory } from '../../../models/order.model';
import * as OrderUtils from '../../../utils/order-calculations.utils';
import { REASON_CATEGORY_LABELS } from '../../../models/order-claim.model';
import { ImageViewerComponent } from '@shared/components/ui/image-viewer/image-viewer.component';

@Component({
  selector: 'app-order-timeline',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    TimelineModule,
    TagModule,
    TooltipModule,
    CommonModule,
    ImageViewerComponent,
  ],
  templateUrl: './order-timeline.component.html',
})
export class OrderTimelineComponent {
  readonly events = input.required<OrderStatusHistory[]>();
  readonly order = input.required<Order>();
  readonly getProductImageUrl = input.required<(url?: string) => string>();

  readonly showDetail = output<OrderStatusHistory>();

  readonly imageViewerVisible = signal(false);
  readonly selectedImageUrl = signal('');
  readonly selectedImageAlt = signal('');

  protected openImage(url: string, alt?: string): void {
    this.selectedImageUrl.set(url);
    this.selectedImageAlt.set(alt || 'Evidencia');
    this.imageViewerVisible.set(true);
  }

  protected getTimelineLabel(event: OrderStatusHistory): string {
    return OrderUtils.getTimelineLabel(event);
  }

  protected getTimelineSeverity(event: OrderStatusHistory): any {
    return OrderUtils.getTimelineSeverity(event);
  }

  protected getTimelineColor(event: OrderStatusHistory): string {
    return OrderUtils.getTimelineColor(event);
  }

  protected hasTimelineDetails(event: OrderStatusHistory): boolean {
    return OrderUtils.hasTimelineDetails(event);
  }

  protected getTimelineDetailType(
    event: OrderStatusHistory,
  ): 'LOGISTICS' | 'CLAIM' | 'PAYMENT' | null {
    return OrderUtils.getTimelineDetailType(event);
  }

  protected getClaimByEvent(event: OrderStatusHistory) {
    return OrderUtils.getClaimByEvent(this.order().claims ?? [], event);
  }

  protected get claimTypeLabels() {
    return OrderUtils.CLAIM_TYPE_LABELS_MAP;
  }

  protected get claimTypeSeverities() {
    return OrderUtils.CLAIM_TYPE_SEVERITY_MAP;
  }

  protected get reasonCategoryLabels() {
    return REASON_CATEGORY_LABELS;
  }

  protected getEventImages(event: OrderStatusHistory): string[] {
    const order = this.order();
    if (!order) return [];

    // Imágenes de logística (envío/entrega)
    if (event.fromStatus !== event.toStatus) {
      if (event.toStatus === 'shipped' || event.toStatus === 'delivered') {
        return OrderUtils.getLogisticsImages(order.logistics, event).map(
          (img) => img.url,
        );
      }

      if (event.toStatus === 'refunded') {
        console.log('es reembolso', order.refunds, event);
        return OrderUtils.getRefundImagesByEvent(
          order.refunds ?? [],
          order.claims ?? [],
          event,
        ).map((img) => img.url);
      }

      return [];
    }

    return OrderUtils.getClaimImagesByEvent(order.claims ?? [], event).map(
      (img) => img.url,
    );
  }
}
