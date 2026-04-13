import { inject, Injectable, signal } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SiteConfigService } from '../services/site-config.service';
import { SiteConfig } from '../models/site-config.model';
import { DialogService } from '@shared/services/ui/dialog.service';
import { SocialLink } from '../models/social-link.model';

@Injectable({ providedIn: 'root' })
export class SiteConfigStore {
  private readonly service = inject(SiteConfigService);
  private readonly dialog = inject(DialogService);
  private readonly destroy = inject(DestroyRef);

  readonly config = signal<SiteConfig | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);

  load(): void {
    this.isLoading.set(true);
    this.service
      .get()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.config.set(res.data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  update(payload: Partial<SiteConfig>, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .update(payload)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          this.config.set(res.data);
          this.isSaving.set(false);
          this.dialog.success('Configuración actualizada', 'Operación exitosa');
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  createSocialLink(dto: SocialLink, onSuccess?: () => void): void {
    this.isSaving.set(true);
    this.service
      .createSocialLink(dto)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.load(); // recarga para reflejar el nuevo link
          this.isSaving.set(false);
          this.dialog.success('Red social agregada', 'Operación exitosa');
          onSuccess?.();
        },
        error: () => this.isSaving.set(false),
      });
  }

  deleteSocialLink(id: string): void {
    this.service
      .deleteSocialLink(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.load();
          this.dialog.success('Red social eliminada', 'Operación exitosa');
        },
        error: () => {},
      });
  }

  reorderSocialLinks(ids: string[]): void {
    this.service
      .reorderSocialLinks(ids)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => this.config.set(res.data),
        error: () => {},
      });
  }
}
