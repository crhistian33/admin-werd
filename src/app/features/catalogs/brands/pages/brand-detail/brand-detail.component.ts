import { Component, computed, inject, input } from '@angular/core';
import { BrandStore } from '../../store/brand.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { Router } from '@angular/router';
import { BRAND_DETAIL_CONFIG } from '../../config/brand-detail.config';
import {
  getDisplayUrl,
  getImageByRole,
} from '@shared/images/interfaces/image.interface';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';

@Component({
  selector: 'app-brand-detail',
  imports: [DetailDynamicComponent],
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.scss',
})
export class BrandDetailComponent {
  private readonly dialog = inject(DialogService);
  private readonly router = inject(Router);
  readonly store = inject(BrandStore);

  id = input.required<string>();
  readonly detailConfig = BRAND_DETAIL_CONFIG;

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  // Mapea selected() inyectando _mainImageUrl para el campo de imagen
  readonly detailData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    const mainImage = getImageByRole(selected.images ?? [], 'logo');

    return {
      ...selected,
      _mainImageUrl: mainImage ? getDisplayUrl(mainImage) : null,
    } as Record<string, any>;
  });

  goBack(): void {
    void this.router.navigate(['/catalogos/marcas']);
  }

  goToEdit(): void {
    void this.router.navigate(['/catalogos/marcas', this.id(), 'editar']);
  }

  onDelete(): void {
    const brand = this.store.selected();
    if (!brand) return;

    this.dialog.delete({
      message: `¿Eliminar la marca <strong>${brand.name}</strong>?
                <br>Podrás recuperarla desde la papelera.`,
      onAccept: () => {
        this.store.softDelete(brand.id, () => this.goBack());
      },
    });
  }
}
