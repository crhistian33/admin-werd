import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerStore } from '../../store/customer.store';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';
import { CUSTOMER_DETAIL_CONFIG } from '../../config/customer-detail.config';
import { DialogService } from '@shared/services/ui/dialog.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [DetailDynamicComponent],
  templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(CustomerStore);
  private readonly dialog = inject(DialogService);

  readonly id = input.required<string>();
  readonly from = input<string>();
  readonly orderId = input<string>();

  readonly config = CUSTOMER_DETAIL_CONFIG;

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  onBack(): void {
    const from = this.from();
    const orderId = this.orderId();

    if (from === 'order-detail' && orderId) {
      void this.router.navigate(['/ventas/pedidos', orderId]);
    } else {
      void this.router.navigate(['/ventas/clientes']);
    }
  }

  onDelete(): void {
    const customer = this.store.selected();
    if (!customer) return;

    this.dialog.delete({
      message: `¿Eliminar al cliente <strong>${customer.firstName} ${customer.lastName}</strong>?
                <br>Podrás recuperarlo desde la papelera.`,
      onAccept: () => {
        this.store.softDelete(customer.id, () => {
          this.onBack();
        });
      },
    });
  }
}
