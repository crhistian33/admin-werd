import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { input } from '@angular/core';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { ProductStore } from '../../store/product.store';
import { buildProductFormConfig } from '../../config/product-form.config';
import { FormStepConfig } from '@shared/types/form-dynamic.type';
import { Product } from '../../models/product.model';
import { CategoryStore } from '@features/catalogs/categories/store/category.store';
import { BrandStore } from '@features/catalogs/brands/store/brand.store';
import {
  getDisplayUrl,
  getImageByRole,
} from '@shared/images/interfaces/image.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormDynamicComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(ProductStore);
  private readonly imageUpload = inject(ImageUploadService);
  private readonly categoryStore = inject(CategoryStore);
  private readonly brandStore = inject(BrandStore);

  // ── Modo creación o edición ───────────────────────────────────────
  readonly id = input<string | null>(null);
  readonly from = input<string | null>(null);
  readonly isEditMode = computed(() => !!this.id());

  // ── Estado del formulario ─────────────────────────────────────────
  readonly loading = computed(() => this.store.isSaving());
  readonly fetching = computed(() => {
    const currentId = this.id();
    if (!currentId) return false;
    return this.store.selected() === null && !!currentId;
  });

  readonly title = computed(() =>
    this.isEditMode() ? 'Editar Producto' : 'Nuevo Producto',
  );

  readonly customActions = computed(() => {
    if (this.isEditMode()) {
      return [];
    }
    return [
      {
        label: 'Guardar y publicar',
        action: 'publish',
        icon: 'pi pi-send',
        severity: 'success',
      },
    ];
  });

  // ── Datos iniciales (para edición) ────────────────────────────────
  readonly initialData = computed<Record<string, any> | null>(() => {
    if (!this.isEditMode()) return null;
    const product = this.store.selected();
    if (!product) return null;
    return this._mapProductToFormData(product);
  });

  // ── Config del formulario con uploadHandler inyectado ────────────
  readonly steps = computed<FormStepConfig[]>(() => {
    return buildProductFormConfig(this.imageUpload, {
      categories: this.categoryStore.data(),
      brands: this.brandStore.data(),
    });
  });

  // ── Lifecycle ─────────────────────────────────────────────────────

  ngOnInit(): void {
    const currentId = this.id();
    if (currentId) {
      this.store.getById(currentId);
    } else {
      this.store.setSelected(null);
    }
  }

  // ── Handlers ──────────────────────────────────────────────────────

  onSubmit(formData: Record<string, any>, statusOverride?: string): void {
    const payload = this._buildPayload(formData);
    const currentId = this.id();

    // Lógica dinámica de Estado:
    if (statusOverride) {
      payload['status'] = statusOverride;
    } else if (!this.id) {
      payload['status'] = 'draft';
    } else {
      payload['status'] = this.initialData()?.['status'] ?? 'draft';
    }

    if (currentId) {
      this.store.update(currentId, payload, () => this._goBack());
    } else {
      this.store.create(payload, () => this._goBack());
    }
  }

  onCustomActionSave(event: { action: string; data: any }): void {
    if (event.action === 'publish') {
      this.onSubmit(event.data, 'active');
    }
  }

  onCancel(): void {
    this._goBack();
  }

  // ── Privados ──────────────────────────────────────────────────────

  /**
   * Convierte el objeto Product al formato plano que espera FormDynamicComponent.
   * Los campos anidados (price, features, specs) se aplanan al nivel raíz.
   */
  private _mapProductToFormData(product: Product): Record<string, any> {
    const mainImage = getImageByRole(product.images ?? [], 'main');
    const galleryImages = (product.images ?? []).filter(
      (i) => i.imageRole === 'gallery',
    );

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      shortDescription: product.shortDescription,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
      status: product.status,
      isFeatured: product.isFeatured,
      metaTitle: product.metaTitle ?? null,
      metaDescription: product.metaDescription ?? null,
      // Precio e Inventario (Coerción a Number para evitar errores de validación)
      price: product.price?.price != null ? Number(product.price.price) : null,
      compareAtPrice:
        product.price?.compareAtPrice != null
          ? Number(product.price.compareAtPrice)
          : null,
      cost: product.price?.cost != null ? Number(product.price.cost) : null,
      stock: product.stock != null ? Number(product.stock) : 0,
      weight: product.weight != null ? Number(product.weight) : null,

      // Imágenes (Inicialización sin afectar el dirty state)
      tempMainImageId: null,
      tempGalleryImageIds: [],

      // Preview de imagen principal mapeada a nuestra llave única
      _currentImageUrl_tempMainImageId: mainImage
        ? getDisplayUrl(mainImage)
        : null,
      _currentImageId_tempMainImageId: mainImage?.id ?? null,

      // Preview interactivo para la pasarela de la galería
      _galleryItems_tempGalleryImageIds: galleryImages.map((img) => ({
        id: img.id,
        url: getDisplayUrl(img),
      })),

      // Listas
      specs: (product.specs ?? []).map((s) => ({
        specKey: s.specKey,
        specValue: s.specValue,
        sortOrder: s.sortOrder,
      })),
      features: (product.features ?? []).map((f) => ({
        feature: f.feature,
        sortOrder: f.sortOrder,
      })),
    };
  }

  /**
   * Construye el payload del backend a partir del valor del formulario.
   * Omite campos de imágenes si son null/undefined para no sobrescribirlas en edición.
   */
  private _buildPayload(formData: Record<string, any>): Record<string, any> {
    const {
      _removedImageIds,
      _currentImageUrl_tempMainImageId, // ← excluir campos internos
      _currentImageId_tempMainImageId,
      _galleryItems_tempGalleryImageIds,
      tempMainImageId,
      tempGalleryImageIds, // ← ahora solo contiene nuevos
      price,
      compareAtPrice,
      cost,
      categoryId,
      brandId,
      ...rest
    } = formData;

    const payload: Record<string, any> = {
      ...rest,
      price,
      compareAtPrice: compareAtPrice ?? undefined,
      cost,
      categoryId,
      brandId,
    };

    // Solo imágenes nuevas (uploads temporales)
    if (tempMainImageId) {
      payload['tempMainImageId'] = tempMainImageId;
    }
    if (tempGalleryImageIds?.length) {
      payload['tempGalleryImageIds'] = tempGalleryImageIds;
    }

    // Imagen principal eliminada
    if (_removedImageIds?.['tempMainImageId']) {
      payload['removedMainImageId'] = _removedImageIds['tempMainImageId'];
    }

    // Imágenes de galería eliminadas (IDs reales de BD)
    if (
      Array.isArray(_removedImageIds?.['tempGalleryImageIds']) &&
      _removedImageIds['tempGalleryImageIds'].length > 0
    ) {
      payload['removedGalleryImageIds'] =
        _removedImageIds['tempGalleryImageIds'];
    }

    return payload;
  }

  private _goBack(): void {
    const currentId = this.id();
    const from = this.from();

    if (from === 'detail' && currentId) {
      void this.router.navigate(['/catalogos/productos', currentId]);
    } else {
      void this.router.navigate(['/catalogos/productos']);
    }
  }
}
