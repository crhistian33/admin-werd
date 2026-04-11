import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryStore } from '../../store/category.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';
import { CATEGORY_DETAIL_CONFIG } from '../../config/category-detail.config';
import {
  getDisplayUrl,
  getImageByRole,
} from '@shared/images/interfaces/image.interface';

@Component({
  selector: 'app-category-detail',
  imports: [DetailDynamicComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  readonly store = inject(CategoryStore);

  readonly id = input.required<string>();
  readonly detailConfig = CATEGORY_DETAIL_CONFIG;

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  // Mapea selected() inyectando _mainImageUrl para el campo de imagen
  readonly detailData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    const mainImage = getImageByRole((selected as any).images ?? [], 'main');

    return {
      ...selected,
      _mainImageUrl: mainImage ? getDisplayUrl(mainImage) : null,
    } as Record<string, any>;
  });

  goBack(): void {
    void this.router.navigate(['/catalogos/categorias']);
  }

  goToEdit(): void {
    void this.router.navigate(['/catalogos/categorias', this.id(), 'editar'], {
      queryParams: { from: 'detail' },
    });
  }

  onDelete(): void {
    const category = this.store.selected();
    if (!category) return;

    this.dialog.delete({
      message: `¿Eliminar la categoría <strong>${(category as any).name}</strong>?
                <br>Podrás recuperarla desde la papelera.`,
      onAccept: () => {
        this.store.softDelete((category as any).id, () => this.goBack());
      },
    });
  }
}
