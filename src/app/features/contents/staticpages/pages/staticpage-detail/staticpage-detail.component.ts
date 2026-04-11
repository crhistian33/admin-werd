import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';
import { DialogService } from '@shared/services/ui/dialog.service';
import { PageStore } from '../../store/page.store';
import { PAGE_DETAIL_CONFIG } from '../../config/staticpage-detail.config';

@Component({
  selector: 'app-staticpage-detail',
  imports: [DetailDynamicComponent],
  templateUrl: './staticpage-detail.component.html',
  styleUrl: './staticpage-detail.component.scss',
})
export class StaticpageDetailComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  readonly store = inject(PageStore);

  readonly id = input.required<string>();
  readonly detailConfig = PAGE_DETAIL_CONFIG;

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
    void this.router.navigate(['/contenidos/paginas-internas']);
  }

  goToEdit(): void {
    void this.router.navigate(
      ['/contenidos/paginas-internas', this.id(), 'editar'],
      { queryParams: { from: 'detail' } },
    );
  }

  onDelete(): void {
    const page = this.store.selected();
    if (!page) return;

    this.dialog.delete({
      message: `¿Eliminar la página <strong>${page.title}</strong>?
                <br>Podrás recuperarla desde la papelera.`,
      onAccept: () => {
        this.store.softDelete(page.id, () => this.goBack());
      },
    });
  }
}
