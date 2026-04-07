import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { GalleriaModule } from 'primeng/galleria';
import { LucideAngularModule } from 'lucide-angular';
import { ProductStore } from '../../store/product.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { ImageRecord } from '@shared/images/interfaces/image.interface';
import { environment } from '@env/environment';
import { Product, ProductStatus } from '../../models/product.model';

// Badge por estado del producto
const STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; severity: string }
> = {
  active: { label: 'Publicado', severity: 'success' },
  inactive: { label: 'Inactivo', severity: 'danger' },
  draft: { label: 'Borrador', severity: 'warn' },
  out_of_stock: { label: 'Sin stock', severity: 'danger' },
};

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    ButtonModule,
    TagModule,
    SkeletonModule,
    TooltipModule,
    GalleriaModule,
    LucideAngularModule,
  ],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialog = inject(DialogService);

  readonly store = inject(ProductStore);

  readonly id = input.required<string>();

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  // ── Computed ──────────────────────────────────────────────────────

  readonly product = computed(() => this.store.selected());

  readonly isLoading = computed(() => this.store.loadingState().initial);

  readonly statusConfig = computed(() => {
    const status = this.product()?.status;
    return status ? STATUS_CONFIG[status] : null;
  });

  readonly mainImage = computed(
    () =>
      this.product()?.images?.find((img) => img.imageRole === 'main') ?? null,
  );

  readonly galleryImages = computed(
    () =>
      this.product()?.images?.filter((img) => img.imageRole === 'gallery') ??
      [],
  );

  readonly allImagesForGalleria = computed(() => {
    const main = this.mainImage();
    const gallery = this.galleryImages();
    const all = main ? [main, ...gallery] : gallery;
    console.log('All images for Galleria:', all);
    return all.map((img) => ({
      itemImageSrc: this.buildUrl(img.variants?.original ?? img.url),
      thumbnailImageSrc: this.buildUrl(img.variants?.thumb ?? img.url),
      alt: img.altText ?? this.product()?.name ?? '',
    }));
  });

  readonly safeDescription = computed((): SafeHtml | null => {
    const desc = this.product()?.description;
    return desc ? this.sanitizer.bypassSecurityTrustHtml(desc) : null;
  });

  readonly margin = computed(() => {
    const price = this.product()?.price?.price ?? 0;
    const cost = this.product()?.price?.cost ?? 0;
    if (!price || !cost) return null;
    return (((price - cost) / price) * 100).toFixed(1);
  });

  // ── Acciones ──────────────────────────────────────────────────────

  goBack(): void {
    void this.router.navigate(['/catalogos/productos']);
  }

  goToEdit(): void {
    void this.router.navigate(['/catalogos/productos', this.id(), 'editar']);
  }

  onDelete(): void {
    const product = this.product();
    if (!product) return;

    this.dialog.delete({
      message: `¿Eliminar <strong>${product.name}</strong>?.<br>Podrás recuperarlo en la papelera.`,
      onAccept: () => {
        this.store.softDelete(product.id, () => this.goBack());
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────

  buildUrl(path: string | null | undefined): string {
    if (!path) return 'assets/images/placeholder.png';
    return path.startsWith('http')
      ? path
      : `${environment.apiImagesUrl}${path}`;
  }
}
