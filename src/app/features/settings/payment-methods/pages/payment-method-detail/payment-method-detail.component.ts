import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '@shared/services/ui/dialog.service';
import { PaymentMethodStore } from '../../store/payment-method.store';
import { PAYMENT_METHOD_DETAIL_CONFIG } from '../../config/payment-method-detail.config';
import { PaymentMethod } from '../../models/payment-method.model';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';

@Component({
  selector: 'app-payment-method-detail',
  imports: [DetailDynamicComponent],
  templateUrl: './payment-method-detail.component.html',
  styleUrl: './payment-method-detail.component.scss',
})
export class PaymentMethodDetailComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  readonly store = inject(PaymentMethodStore);

  readonly id = input.required<string>();
  readonly detailConfig = PAYMENT_METHOD_DETAIL_CONFIG;

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  // Mapea selected() inyectando _mainImageUrl para el campo de imagen
  readonly detailData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    return selected;
  });

  goBack(): void {
    void this.router.navigate(['/configuraciones/metodos-pago']);
  }

  goToEdit(): void {
    void this.router.navigate(
      ['/configuraciones/metodos-pago', this.id(), 'editar'],
      { queryParams: { from: 'detail' } },
    );
  }

  onDelete(): void {
    const paymentMethod = this.store.selected();
    if (!paymentMethod) return;

    this.dialog.delete({
      message: `¿Eliminar <strong>${paymentMethod.name}</strong> permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(paymentMethod.id, () => {
          this.goBack();
        });
      },
    });
  }
}
