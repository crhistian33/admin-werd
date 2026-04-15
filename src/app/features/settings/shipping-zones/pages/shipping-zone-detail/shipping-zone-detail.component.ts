import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';
import { DialogService } from '@shared/services/ui/dialog.service';
import { ShippingZoneStore } from '../../store/shipping-zone.store';
import { SHIPPING_ZONE_DETAIL_CONFIG } from '../../config/shipping-zone-detail.config';

@Component({
  selector: 'app-shipping-zone-detail',
  imports: [DetailDynamicComponent],
  templateUrl: './shipping-zone-detail.component.html',
  styleUrl: './shipping-zone-detail.component.scss',
})
export class ShippingZoneDetailComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  readonly store = inject(ShippingZoneStore);

  readonly id = input.required<string>();
  readonly detailConfig = SHIPPING_ZONE_DETAIL_CONFIG;

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
    void this.router.navigate(['/configuraciones/zonas-envio']);
  }

  goToEdit(): void {
    void this.router.navigate(
      ['/configuraciones/zonas-envio', this.id(), 'editar'],
      { queryParams: { from: 'detail' } },
    );
  }

  onDelete(): void {
    const shippingZone = this.store.selected();
    if (!shippingZone) return;

    this.dialog.delete({
      message: `¿Eliminar <strong>${shippingZone.name}</strong> permanentemente?
                <br><br>Esta acción <strong>no se puede deshacer</strong>.`,
      acceptLabel: 'Eliminar permanentemente',
      onAccept: () => {
        this.store.delete(shippingZone.id, () => {
          this.goBack();
        });
      },
    });
  }
}
