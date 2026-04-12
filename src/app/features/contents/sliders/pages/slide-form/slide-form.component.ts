import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { HeroSlideStore } from '../../store/hero-slide.store';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { buildHeroSlideFormConfig } from '../../config/hero-slide-form.config';
import {
  getDisplayUrl,
  getImageByRole,
} from '@shared/images/interfaces/image.interface';
import { ProductStore } from '@features/catalogs/products/store/product.store';
import { CategoryStore } from '@features/catalogs/categories/store/category.store';

@Component({
  selector: 'app-slide-form',
  imports: [FormDynamicComponent],
  templateUrl: './slide-form.component.html',
  styleUrl: './slide-form.component.scss',
})
export class SlideFormComponent {
  private readonly router = inject(Router);
  private readonly imageUpload = inject(ImageUploadService);
  readonly store = inject(HeroSlideStore);
  readonly productsStore = inject(ProductStore);
  readonly categoriesStore = inject(CategoryStore);

  readonly steps = computed<FormStepConfig[]>(() => {
    const config = buildHeroSlideFormConfig(this.imageUpload, {
      products: this.productsStore.data(),
      categories: this.categoriesStore.data(),
    });

    if (!this.isEdit()) {
      return config.map((s) => ({
        ...s,
        fields: s.fields.filter((f) => f.showOnCreate !== false),
      }));
    }

    return config;
  });

  readonly id = input<string | null>(null);
  readonly from = input<string | null>(null);
  readonly isEdit = computed(() => !!this.id());

  // initialData como computed — no se recrea en cada ciclo de detección de cambios
  readonly initialData = computed(() => {
    const selected = this.store.selected();
    if (!selected) return null;

    const desktopImage = getImageByRole(selected.images ?? [], 'desktop');
    const mobileImage = getImageByRole(selected.images ?? [], 'mobile');

    return {
      id: selected.id,
      title: selected.title,
      subtitle: selected.subtitle,
      linkType: selected.linkType,
      linkProductId: selected.linkProductId ?? null,
      linkCategoryId: selected.linkCategoryId ?? null,
      linkUrl: selected.linkUrl ?? null,
      linkText: selected.linkText ?? null,
      sortOrder: selected.sortOrder,
      isActive: selected.isActive,
      startsAt: selected.startsAt ? new Date(selected.startsAt) : null,
      endsAt: selected.endsAt ? new Date(selected.endsAt) : null,

      tempDesktopImageId: null,
      tempMobileImageId: null,

      // ← nombres correctos que lee FormDynamicComponent
      _currentImageUrl_tempDesktopImageId: desktopImage
        ? getDisplayUrl(desktopImage)
        : null,
      _currentImageId_tempDesktopImageId: desktopImage?.id ?? null,

      _currentImageUrl_tempMobileImageId: mobileImage
        ? getDisplayUrl(mobileImage)
        : null,
      _currentImageId_tempMobileImageId: mobileImage?.id ?? null,
    };
  });

  ngOnInit(): void {
    const currentId = this.id();
    if (currentId) {
      this.store.getById(currentId);
    } else {
      this.store.setSelected(null);
    }
  }

  onSubmit(data: Record<string, any>): void {
    // Extrae los campos internos que no van al backend
    const {
      _currentImageUrl_tempDesktopImageId,
      _currentImageId_tempDesktopImageId,
      _currentImageUrl_tempMobileImageId,
      _currentImageId_tempMobileImageId,
      _removedImageIds,
      tempDesktopImageId,
      tempMobileImageId,
      ...rest
    } = data;

    const payload: Record<string, any> = { ...rest };

    if (tempDesktopImageId) {
      payload['tempDesktopImageId'] = tempDesktopImageId;
    }
    const removedDesktopId = (_removedImageIds as Record<string, string>)?.[
      'tempDesktopImageId'
    ];
    if (!tempDesktopImageId && removedDesktopId) {
      payload['removedDesktopImageId'] = removedDesktopId;
    }

    if (tempMobileImageId) {
      payload['tempMobileImageId'] = tempMobileImageId;
    }
    const removedMobileId = (_removedImageIds as Record<string, string>)?.[
      'tempMobileImageId'
    ];
    if (!tempMobileImageId && removedMobileId) {
      payload['removedMobileImageId'] = removedMobileId;
    }

    if (this.isEdit()) {
      this.store.update(this.id()!, payload, () => this._goBack());
    } else {
      this.store.create(payload, () => this._goBack());
    }
  }

  _goBack(): void {
    const currentId = this.id();
    const from = this.from();

    if (from === 'detail' && currentId) {
      void this.router.navigate(['/contenidos/destacados', currentId]);
    } else {
      void this.router.navigate(['/contenidos/destacados']);
    }
  }
}
