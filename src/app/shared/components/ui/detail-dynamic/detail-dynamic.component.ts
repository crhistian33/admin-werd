import { Component, computed, inject, input, output } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { GalleriaModule } from 'primeng/galleria';
import { LucideAngularModule } from 'lucide-angular';
import {
  DetailViewConfig,
  DetailSectionConfig,
  DetailFieldConfig,
  BadgeOption,
} from '@shared/types/detail-view.type';
import { environment } from '@env/environment';

@Component({
  selector: 'app-detail-dynamic',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    ButtonModule,
    TagModule,
    SkeletonModule,
    GalleriaModule,
    LucideAngularModule,
  ],
  templateUrl: './detail-dynamic.component.html',
  styleUrl: './detail-dynamic.component.scss',
})
export class DetailDynamicComponent {
  private readonly sanitizer = inject(DomSanitizer);

  // ── Inputs ────────────────────────────────────────────────────────
  readonly config = input.required<DetailViewConfig>();
  readonly data = input<Record<string, any> | null>(null);
  readonly loading = input<boolean>(false);
  readonly title = input<string>('');
  readonly subtitle = input<string>('');

  // ── Outputs ───────────────────────────────────────────────────────
  readonly onEdit = output<void>();
  readonly onDelete = output<void>();
  readonly onBack = output<void>();

  // ── Computed ──────────────────────────────────────────────────────
  readonly hasData = computed(() => !!this.data());

  // ── Helpers públicos ──────────────────────────────────────────────

  getValue(key: string): any {
    const item = this.data();
    if (!item) return null;
    return key.split('.').reduce((obj: any, k) => obj?.[k], item);
  }

  getFieldValue(field: DetailFieldConfig): any {
    return this.getValue(field.key);
  }

  getFormattedValue(field: DetailFieldConfig): string {
    const raw = this.getFieldValue(field);
    const item = this.data() ?? {};
    if (field.format) return field.format(raw, item);
    if (raw === null || raw === undefined) return '—';
    return String(raw);
  }

  getBadge(field: DetailFieldConfig): BadgeOption | null {
    const raw = this.getFieldValue(field);
    if (raw === null || raw === undefined) return null;

    if (field.badges?.length) {
      return field.badges.find((b) => b.value === raw) ?? null;
    }
    if (field.type === 'boolean') {
      return raw
        ? { value: true, label: 'Activo', severity: 'success' }
        : { value: false, label: 'Inactivo', severity: 'danger' };
    }
    return null;
  }

  buildUrl(path: string | null | undefined, baseUrl?: string): string {
    if (!path) return 'assets/images/placeholder.png';
    const base = baseUrl ?? environment.apiImagesUrl;
    return String(path).startsWith('http') ? String(path) : `${base}${path}`;
  }

  isVisible(field: DetailFieldConfig): boolean {
    const item = this.data();
    if (!item) return false;
    return field.visible ? field.visible(item) : true;
  }

  // ── Gallery ───────────────────────────────────────────────────────

  getGalleriaItems(field: DetailFieldConfig): any[] {
    const images = this.getFieldValue(field);
    if (!Array.isArray(images)) return [];

    // Ordenar: 'main' primero, luego 'gallery', el resto al final
    const sorted = [...images].sort((a, b) => {
      const order: Record<string, number> = { main: 0, gallery: 1 };
      return (order[a.imageRole] ?? 2) - (order[b.imageRole] ?? 2);
    });

    return sorted.map((img: any) => ({
      itemImageSrc: this.buildUrl(
        img.variants?.original ?? img.url,
        field.imageBaseUrl,
      ),
      thumbnailImageSrc: this.buildUrl(
        img.variants?.thumb ?? img.url,
        field.imageBaseUrl,
      ),
      alt: img.altText ?? '',
    }));
  }

  // ── Specs ─────────────────────────────────────────────────────────

  getSpecs(field: DetailFieldConfig): { specKey: string; specValue: string }[] {
    const key = field.specsKey ?? field.key;
    const arr = this.getValue(key);
    return Array.isArray(arr) ? arr : [];
  }

  // ── Features ──────────────────────────────────────────────────────

  getFeatures(field: DetailFieldConfig): { feature: string }[] {
    const key = field.featuresKey ?? field.key;
    const arr = this.getValue(key);
    return Array.isArray(arr) ? arr : [];
  }

  // ── Price block ───────────────────────────────────────────────────

  getPriceData(field: DetailFieldConfig) {
    const price = parseFloat(
      this.getValue(field.priceKey ?? 'price.price') ?? 0,
    );
    const cost = parseFloat(this.getValue(field.costKey ?? 'price.cost') ?? 0);
    const compare = this.getValue(field.compareKey ?? 'price.compareAtPrice');
    const margin =
      price && cost ? (((price - cost) / price) * 100).toFixed(1) : null;

    return { price, cost: cost || null, compare, margin };
  }

  // ── HTML ──────────────────────────────────────────────────────────

  getSafeHtml(field: DetailFieldConfig): SafeHtml | null {
    const raw = this.getFieldValue(field);
    return raw ? this.sanitizer.bypassSecurityTrustHtml(raw) : null;
  }

  // ── Grid span ─────────────────────────────────────────────────────

  getSectionClass(section: DetailSectionConfig): string {
    return section.span === 2 ? 'lg:col-span-2' : '';
  }
}
