import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductStore } from '../../store/product.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';
import { PRODUCT_DETAIL_CONFIG } from '../../config/product-detail.config';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DetailDynamicComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  readonly store = inject(ProductStore);

  readonly id = input.required<string>();

  readonly detailConfig = PRODUCT_DETAIL_CONFIG;

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  goBack(): void {
    void this.router.navigate(['/catalogos/productos']);
  }

  goToEdit(): void {
    void this.router.navigate(['/catalogos/productos', this.id(), 'editar'], {
      queryParams: { from: 'detail' },
    });
  }

  onDelete(): void {
    const product = this.store.selected();
    if (!product) return;

    this.dialog.delete({
      message: `¿Eliminar <strong>${product.name}</strong>?
                <br>Podrás recuperarlo desde la papelera.`,
      onAccept: () => {
        this.store.softDelete((product as any).id, () => this.goBack());
      },
    });
  }
}
