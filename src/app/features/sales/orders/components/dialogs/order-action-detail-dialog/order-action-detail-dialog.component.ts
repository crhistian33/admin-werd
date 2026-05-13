import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Order, OrderStatusHistory } from '../../../models/order.model';
import {
  CLAIM_TYPE_LABELS,
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_SEVERITY,
  REASON_CATEGORY_LABELS,
} from '../../../models/order-claim.model';
import { environment } from '@env/environment';
import { ImageViewerComponent } from '@shared/components/ui/image-viewer/image-viewer.component';

@Component({
  selector: 'app-order-action-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TagModule,
    CurrencyPipe,
    DatePipe,
    ImageViewerComponent,
  ],
  templateUrl: './order-action-detail-dialog.component.html',
})
export class OrderActionDetailDialogComponent {
  readonly visible = model<boolean>(false);
  readonly order = input<Order | null>(null);
  readonly event = input<OrderStatusHistory | null>(null);
  readonly header = input<string>('Detalles de la Acción');
  readonly close = output<void>();

  protected readonly CLAIM_TYPE_LABELS = CLAIM_TYPE_LABELS;
  protected readonly CLAIM_STATUS_LABELS = CLAIM_STATUS_LABELS;
  protected readonly CLAIM_STATUS_SEVERITY = CLAIM_STATUS_SEVERITY;
  protected readonly REASON_CATEGORY_LABELS = REASON_CATEGORY_LABELS;

  readonly imageViewerVisible = signal(false);
  readonly selectedImageUrl = signal('');
  readonly selectedImageAlt = signal('');

  protected openImage(url: string, alt?: string): void {
    this.selectedImageUrl.set(url);
    this.selectedImageAlt.set(alt || 'Evidencia');
    this.imageViewerVisible.set(true);
  }

  /** Imágenes del claim filtradas por tipo de evento */
  protected readonly claimImages = computed(() => {
    const ev = this.event();
    const claim = this.claim();
    if (!ev || !claim?.images?.length) return [];

    const comment = ev.comment?.toLowerCase() ?? '';

    // Reembolso → comprobante
    if (comment.includes('reembolso')) {
      return claim.images.filter((img) => img.imageRole === 'refund_evidence');
    }

    // Envío → fotos del paquete
    if (
      comment.includes('envío') ||
      comment.includes('tracking') ||
      comment.includes('courier')
    ) {
      return claim.images.filter(
        (img) =>
          img.imageRole === 'return_evidence' ||
          img.imageRole === 'return_shipment',
      );
    }

    // Recepción → fotos del producto
    if (comment.includes('recibido') || comment.includes('recibida')) {
      return claim.images.filter(
        (img) => img.imageRole === 'customer_evidence',
      );
    }

    // Default: todas
    console.log('todas las imagenes', claim.images);

    return claim.images;
  });

  protected isRefundEvent(): boolean {
    return this.event()?.comment?.toLowerCase()?.includes('reembolso') ?? false;
  }

  protected isShipmentEvent(): boolean {
    const c = this.event()?.comment?.toLowerCase() ?? '';
    return (
      c.includes('envío') || c.includes('tracking') || c.includes('courier')
    );
  }

  protected isReceptionEvent(): boolean {
    return this.event()?.comment?.toLowerCase()?.includes('recibido') ?? false;
  }

  protected readonly detailType = computed(() => {
    const ev = this.event();
    if (!ev) return null;

    // 1. Prioridad: Reclamos y actualizaciones del mismo estado
    if (ev.fromStatus === ev.toStatus) return 'CLAIM';

    // 2. Transiciones específicas
    // Solo mostramos logística si el cambio fue HACIA enviado
    if (ev.toStatus === 'shipped' && ev.fromStatus !== 'shipped') {
      return 'LOGISTICS';
    }

    // Solo mostramos delivery si el cambio fue HACIA entregado
    if (ev.toStatus === 'delivered' && ev.fromStatus !== 'delivered') {
      return 'DELIVERY';
    }

    // Solo mostramos pago si el cambio fue HACIA pagado
    if (ev.toStatus === 'paid' && ev.fromStatus !== 'paid') return 'PAYMENT';

    return null;
  });

  protected readonly logistics = computed(() => this.order()?.logistics);

  protected readonly claim = computed(() => {
    // ... logic for claims
    const ev = this.event();
    const claims = this.order()?.claims ?? [];
    if (!ev || ev.fromStatus !== ev.toStatus) return null;

    const comment = ev.comment?.toLowerCase() ?? '';
    return (
      claims.find((c) => comment.includes(c.claimNumber.toLowerCase())) || null
    );
  });

  protected readonly transactions = computed(() => {
    const ev = this.event();
    const all = this.order()?.transactions ?? [];
    if (!ev || ev.toStatus !== 'paid') return [];

    // Devolvemos transacciones cercanas a la fecha del evento
    // Aumentamos a 30 minutos de margen para mayor robustez
    const evDate = new Date(ev.createdAt).getTime();
    return all.filter((t) => {
      const tDate = new Date(t.createdAt).getTime();
      return Math.abs(tDate - evDate) < 1800000; // 30 minutos de margen
    });
  });

  protected readonly adminNotes = computed(() => {
    const o = this.order();
    const ev = this.event();
    if (!o || !ev) return null;

    // Solo mostramos la nota global si el evento es el más reciente del pedido
    const history = o.statusHistory ?? [];
    const isLatest = history.length > 0 && history[0].id === ev.id;

    return isLatest ? o.adminNotes : null;
  });

  protected readonly logisticsImages = computed(() => {
    const o = this.order();
    const ev = this.event();
    if (!o || !ev) return [];

    const allImages = o.logistics?.images ?? [];
    const role =
      ev.toStatus === 'shipped' ? 'shipping_evidence' : 'delivery_evidence';

    return allImages.filter((img: any) => img.imageRole === role);
  });

  protected readonly formattedComment = computed(() => {
    const ev = this.event();
    if (!ev || !ev.comment) return null;
    let text = ev.comment;

    if (
      text.includes('Cancelación parcial aprobada') &&
      text.includes('Nuevo total:')
    ) {
      const c = this.claim();
      if (c && c.items) {
        const cancelledAmount = c.items.reduce((sum, item) => {
          const oi = item.orderItem;
          if (!oi) return sum;
          const unitNet =
            Number(oi.unitPrice) -
            Number(oi.discountAmount) / Math.max(1, Number(oi.quantity));
          return sum + unitNet * item.quantity;
        }, 0);
        text = text.replace(
          /Nuevo total:.*/,
          `Monto total cancelado: S/ ${cancelledAmount.toFixed(2)}`,
        );
      } else {
        text = text.replace('Nuevo total:', 'Monto original del pedido:');
      }
    }

    return text;
  });

  protected getProductImageUrl(url?: string | null): string {
    if (!url) return 'assets/images/placeholder.png';
    return url.startsWith('http') ? url : `${environment.apiImagesUrl}${url}`;
  }

  protected onHide(): void {
    this.close.emit();
  }
}
