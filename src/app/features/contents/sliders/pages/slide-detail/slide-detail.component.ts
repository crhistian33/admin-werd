import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';
import { DialogService } from '@shared/services/ui/dialog.service';
import { HeroSlideStore } from '../../store/hero-slide.store';
import { HERO_SLIDE_DETAIL_CONFIG } from '../../config/hero-slide-detail.config';
import {
  getDisplayUrl,
  getImageByRole,
} from '@shared/images/interfaces/image.interface';

@Component({
  selector: 'app-slide-detail',
  imports: [DetailDynamicComponent],
  templateUrl: './slide-detail.component.html',
  styleUrl: './slide-detail.component.scss',
})
export class SlideDetailComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  readonly store = inject(HeroSlideStore);

  readonly id = input.required<string>();
  readonly detailConfig = HERO_SLIDE_DETAIL_CONFIG;

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  // Mapea selected() inyectando _mainImageUrl para el campo de imagen
  readonly detailData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    const desktopImage = getImageByRole(
      (selected as any).images ?? [],
      'desktop',
    );
    const mobileImage = getImageByRole(
      (selected as any).images ?? [],
      'mobile',
    );

    return {
      ...selected,
      _mainDesktopImageUrl: desktopImage ? getDisplayUrl(desktopImage) : null,
      _mainMobileImageUrl: mobileImage ? getDisplayUrl(mobileImage) : null,
    } as Record<string, any>;
  });

  goBack(): void {
    void this.router.navigate(['/contenidos/destacados']);
  }

  goToEdit(): void {
    void this.router.navigate(['/contenidos/destacados', this.id(), 'editar'], {
      queryParams: { from: 'detail' },
    });
  }

  onDelete(): void {
    const slide = this.store.selected();
    if (!slide) return;

    this.dialog.delete({
      message: `¿Eliminar el slide <strong>${(slide as any).title}</strong>?
                <br>Podrás recuperarlo desde la papelera.`,
      onAccept: () => {
        this.store.softDelete((slide as any).id, () => this.goBack());
      },
    });
  }
}
