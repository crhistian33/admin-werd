import { Component, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { OrderListModule } from 'primeng/orderlist';
import { LucideAngularModule } from 'lucide-angular';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from '@shared/services/ui/dialog.service';
import { SiteConfigStore } from '../../store/site-config.store';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-social-links-manager',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CheckboxModule,
    OrderListModule,
    LucideAngularModule,
    TagModule,
    DialogModule,
    SelectModule,
  ],
  templateUrl: './social-links-manager.component.html',
  styleUrl: './social-links-manager.component.scss',
})
export class SocialLinksManagerComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(DialogService);
  readonly store = inject(SiteConfigStore);

  readonly dialogVisible = signal(false);
  selectedLinks: any[] = [];

  readonly links = computed(() => this.store.config()?.socialLinks ?? []);

  readonly networkOptions = [
    { label: 'Facebook', value: 'facebook', icon: 'pi pi-facebook' },
    { label: 'Instagram', value: 'instagram', icon: 'pi pi-instagram' },
    { label: 'Twitter / X', value: 'twitter', icon: 'pi pi-twitter' },
    { label: 'YouTube', value: 'youtube', icon: 'pi pi-youtube' },
    { label: 'TikTok', value: 'tiktok', icon: 'pi pi-tiktok' },
    { label: 'LinkedIn', value: 'linkedin', icon: 'pi pi-linkedin' },
    { label: 'WhatsApp', value: 'whatsapp', icon: 'pi pi-whatsapp' },
  ];

  readonly form = this.fb.nonNullable.group({
    network: ['', Validators.required],
    name: ['', Validators.required],
    icon: [''],
    url: ['', [Validators.required, Validators.pattern('https?://.+')]],
    sortOrder: [0],
  });

  openDialog(): void {
    this.form.reset();
    this.dialogVisible.set(true);
  }

  onNetworkChange(event: any): void {
    const selected = this.networkOptions.find((o) => o.value === event.value);
    if (selected) {
      this.form.patchValue({
        name: selected.label,
        icon: selected.icon,
      });
    }
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.store.createSocialLink(
      { ...this.form.getRawValue(), isActive: true },
      () => this.dialogVisible.set(false),
    );
  }

  onDelete(link: any): void {
    this.dialog.delete({
      message: `¿Eliminar <strong>${link.name}</strong>?`,
      onAccept: () => this.store.deleteSocialLink(link.id),
    });
  }

  onReorder(event: any): void {
    const currentLinks = this.links();
    if (currentLinks.length === 0) return;

    const reordered = [...currentLinks];
    const moved = reordered.splice(event.dragIndex, 1)[0];
    reordered.splice(event.dropIndex, 0, moved);

    const ids = reordered.map((l) => l.id).filter((id): id is string => !!id);

    // Solo llamar al API si el orden realmente cambió
    if (ids.length === currentLinks.length) {
      this.store.reorderSocialLinks(ids);
    }

    this.selectedLinks = [];
  }
}
