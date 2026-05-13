import { Order, OrderItem } from '../models/order.model';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { buildConfirmPaymentFormConfig } from './confirm-payment-form.config';
import { buildCancelOrderFormConfig } from './cancel-order-form.config';
import { buildDeliverOrderFormConfig } from './deliver-order-form.config';
import { buildLogisticsFormConfig } from './order-logistic-form.config';
import { buildClaimFormConfig } from './order-claim-form.config';
import { buildMarkClaimReceivedFormConfig } from './mark-claim-received-form.config';
import { buildCompleteRefundFormConfig } from './complete-refund-form.config';
import { buildConfirmReturnShipmentFormConfig } from './confirm-return-shipment-form.config';
import { buildReviewClaimFormConfig } from './review-claim-form.config';
import { DialogDynamicConfig } from '@shared/types/dialog-dynamic.type';
import * as OrderUtils from '../utils/order-calculations.utils';
import { OrderClaim, REASON_CATEGORY_LABELS } from '../models/order-claim.model';

export function getActionConfig(
  action: string,
  order: Order,
  imageUpload: ImageUploadService,
  totalAdjustments?: number,
  targetClaim?: OrderClaim,
): DialogDynamicConfig | null {
  const isManualPayment = OrderUtils.isManualPayment(order);
  const isCashOnDelivery = OrderUtils.isCashOnDelivery(order);
  const isCardPayment = OrderUtils.isCardPayment(order);

  switch (action) {
    case 'confirm-payment':
      return {
        title: 'Confirmar Pago',
        width: '600px',
        submitLabel: 'Confirmar pago',
        formSteps: buildConfirmPaymentFormConfig(
          totalAdjustments ?? order.total,
        ),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          {
            label: 'Total',
            value: formatTotal(totalAdjustments ?? order.total),
          },
          { label: 'Método', value: order.paymentMethod?.name || '' },
        ],
      };

    case 'cancel-order':
      const isPaidOrProcessing = ['paid', 'processing'].includes(order.status);
      const isCOD = order.paymentMethod?.type === 'cash_on_delivery';
      const needsRefund = isPaidOrProcessing && !isCOD;
      const isCard = order.paymentMethod?.type === 'card';
      return {
        title: 'Cancelar Pedido',
        width: '700px',
        submitLabel: 'Confirmar cancelación',
        formSteps: buildCancelOrderFormConfig(
          order.status,
          order.items || [],
          needsRefund,
          isCard,
        ),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          { label: 'Total', value: formatTotal(order.total) },
        ],
      };

    case 'ship-order':
      const isEditingLogistics =
        order.status === 'shipped' || order.status === 'delivered';

      let shipOrderInitialData: Record<string, any> | null = null;
      if (isEditingLogistics && order.logistics) {
        const shippingImages = order.logistics.images?.filter(
          (img) => img.imageRole === 'shipping_evidence' && img.url,
        );
        shipOrderInitialData = {
          ...order.logistics,
          _galleryItems_tempImageIds: shippingImages?.map((img) => ({
            id: img.id,
            url: img.url,
          })),
        };
      }

      return {
        title: isEditingLogistics ? 'Editar Logística' : 'Enviar Pedido',
        width: '700px',
        submitLabel: isEditingLogistics
          ? 'Guardar cambios'
          : 'Enviar pedido',
        initialData: shipOrderInitialData,
        formSteps: buildLogisticsFormConfig(imageUpload),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          {
            label: 'Dirección',
            value: order.shippingAddress?.addressLine || '',
          },
        ],
      };

    case 'deliver-order':
      return {
        title: 'Confirmar Entrega',
        width: '600px',
        submitLabel: 'Confirmar entrega',
        formSteps: buildDeliverOrderFormConfig(
          imageUpload,
          isCashOnDelivery,
          Number(order.total) || 0,
        ),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          { label: 'Total', value: formatTotal(order.total) },
        ],
      };

    case 'create-claim':
      return {
        title: 'Nuevo Reclamo',
        width: '700px',
        submitLabel: 'Crear reclamo',
        formSteps: buildClaimFormConfig(
          imageUpload,
          order.status,
          order.items || [],
        ),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          {
            label: 'Estado Actual',
            value: OrderUtils.getStatusLabel(order.status),
            severity: OrderUtils.getStatusSeverity(order.status),
          },
        ],
      };

    case 'mark-received':
      const receiveClaim =
        targetClaim ||
        order.claims?.find(
          (c) =>
            c.status === 'APPROVED' &&
            (c.type === 'REFUND' || c.type === 'REPLACEMENT'),
        );
      return {
        title: 'Recibir Producto de Reclamo',
        width: '500px',
        submitLabel: 'Registrar recepción',
        formSteps: buildMarkClaimReceivedFormConfig(
          receiveClaim?.reasonCategory,
        ),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          ...(receiveClaim
            ? [{ label: 'Reclamo', value: receiveClaim.claimNumber }]
            : []),
        ],
      };

    case 'complete-refund':
      const refundClaim =
        targetClaim ||
        order.claims?.find(
          (c) =>
            (c.status === 'RECEIVED' && c.type === 'REFUND') ||
            (c.status === 'APPROVED' &&
              c.type === 'CANCELLATION' &&
              order.status !== 'pending_payment'),
        );
      const refundAmount = refundClaim
        ? OrderUtils.getClaimRefundAmount(refundClaim)
        : 0;

      const itemsSummary = refundClaim?.items
        ?.map(
          (ci) =>
            `${ci.quantity} ${ci.orderItem?.productName} - S/ ${ci.orderItem?.unitPrice ? formatTotal(ci.orderItem?.unitPrice * ci.quantity) : '0.00'}`,
        )
        .join('<br>');

      //Nuevo
      const transaction = order.transactions?.find(
        (tx) => tx.status === 'completed',
      );

      return {
        title: 'Procesar Reembolso',
        width: '600px',
        submitLabel: 'Completar reembolso',
        formSteps: buildCompleteRefundFormConfig(
          imageUpload,
          //order.paymentMethod?.type === 'card',
          //isCashOnDelivery,
          {
            isCardPayment: order.paymentMethod?.type === 'card',
            isCashOnDelivery: order.paymentMethod?.code === 'cash_on_delivery',
            gatewayTransactionId: transaction?.gatewayTransactionId,
            totalToRefund: refundAmount,
            // ✅ Datos YA definidos en el envío de retorno (solo lectura)
            refundMethod: refundClaim?.refundMethod,
            refundAccountDetails: refundClaim?.refundAccountDetails,
            items: itemsSummary ?? '',
          },
        ),
        contextInfo: [
          { label: 'Reclamo', value: refundClaim?.claimNumber || 'N/A' },
          { label: 'Pedido', value: order.orderNumber },
          { label: 'Original', value: order.paymentMethod?.name || '' },
          // ✅ Solo mostrar si hay items
          // ...(itemsSummary
          //   ? [{ label: 'Productos', value: itemsSummary }]
          //   : []),
          {
            label: 'Monto a Reembolsar',
            value: formatTotal(refundAmount),
            severity: 'danger',
          },
        ],
      };

    case 'register-return-shipment':
      const expectedReturnClaim =
        targetClaim ||
        order.claims?.find(
          (c) =>
            (c.type === 'REFUND' || c.type === 'REPLACEMENT') &&
            c.status === 'APPROVED',
        );

      const hasShopResponsibility =
        expectedReturnClaim?.reasonCategory === 'STORE_ERROR' ||
        expectedReturnClaim?.reasonCategory === 'PRODUCT_FAULT';

      const isRefundReturn = expectedReturnClaim?.type === 'REFUND';

      return {
        title: 'Registrar Envío de Retorno',
        width: '600px',
        submitLabel: 'Registrar envío',
        formSteps: buildConfirmReturnShipmentFormConfig(
          imageUpload,
          hasShopResponsibility || false,
          isCardPayment,
          isRefundReturn,
        ),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          ...(expectedReturnClaim
            ? [
                {
                  label: 'Motivo',
                  value:
                    REASON_CATEGORY_LABELS[
                      expectedReturnClaim.reasonCategory
                    ] || expectedReturnClaim.reasonCategory,
                },
              ]
            : []),
        ],
      };

    case 'review-claim':
      const reviewClaim =
        targetClaim || order.claims?.find((c) => c.status === 'PENDING');
      return {
        title: 'Revisar Reclamo',
        width: '500px',
        submitLabel: 'Confirmar revisión',
        formSteps: buildReviewClaimFormConfig(),
        contextInfo: [
          { label: 'Pedido', value: order.orderNumber },
          {
            label: 'Reclamo',
            value: reviewClaim?.claimNumber || 'PENDIENTE',
            severity: reviewClaim ? 'info' : 'warn',
          },
        ],
      };

    default:
      return null;
  }
}

function formatTotal(total: number): string {
  if (total === null || total === undefined) return 'S/ 0.00';

  const numericTotal = typeof total === 'string' ? parseFloat(total) : total;

  if (isNaN(numericTotal)) return 'S/ 0.00';

  return `S/ ${numericTotal.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
