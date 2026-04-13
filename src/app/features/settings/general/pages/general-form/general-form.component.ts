import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormDynamicComponent } from '@shared/components/ui/form-dynamic/form-dynamic.component';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { environment } from '@env/environment';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { SiteConfigStore } from '../../store/site-config.store';
import { buildSiteConfigFormConfig } from '../../config/site-config-form.config';
import { SocialLinksManagerComponent } from '../../components/social-links-manager/social-links-manager.component';

@Component({
  selector: 'app-general-form',
  imports: [
    FormDynamicComponent,
    SocialLinksManagerComponent,
    TabsModule,
    BadgeModule,
  ],
  templateUrl: './general-form.component.html',
  styleUrl: './general-form.component.scss',
})
export class GeneralFormComponent implements OnInit {
  private readonly imageUpload = inject(ImageUploadService);
  readonly store = inject(SiteConfigStore);

  readonly formDynamic = viewChild<FormDynamicComponent>('formDynamic');

  readonly steps = computed(() => buildSiteConfigFormConfig(this.imageUpload));

  readonly initialData = computed(() => {
    const config = this.store.config();
    if (!config) return null;

    const headerLogo = config.images?.find(
      (img: any) => img.imageRole === 'logo_header',
    );
    const footerLogo = config.images?.find(
      (img: any) => img.imageRole === 'logo_footer',
    );

    return {
      id: config.id,
      storeName: config.storeName,
      storeEmail: config.storeEmail,
      supportEmail: config.supportEmail ?? null,
      phonePrimary: config.phonePrimary ?? null,
      phoneSecondary: config.phoneSecondary ?? null,
      whatsappNumber: config.whatsappNumber ?? null,
      address: config.address ?? null,
      currency: config.currency,
      taxRate: config.taxRate ? Number(config.taxRate) : null,
      metaTitle: config.metaTitle ?? null,
      metaDescription: config.metaDescription ?? null,
      googleAnalyticsId: config.googleAnalyticsId ?? null,
      facebookPixelId: config.facebookPixelId ?? null,
      // Logos
      tempLogoHeaderId: null,
      tempLogoFooterId: null,
      _currentImageUrl_tempLogoHeaderId: headerLogo?.variants?.original
        ? `${environment.apiImagesUrl}${headerLogo.variants.original}`
        : null,
      _currentImageId_tempLogoHeaderId: headerLogo?.id ?? null,
      _currentImageUrl_tempLogoFooterId: footerLogo?.variants?.original
        ? `${environment.apiImagesUrl}${footerLogo.variants.original}`
        : null,
      _currentImageId_tempLogoFooterId: footerLogo?.id ?? null,
    };
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.store.load();
  }

  onSubmit(data: Record<string, any>): void {
    const {
      _currentImageUrl_tempLogoHeaderId,
      _currentImageId_tempLogoHeaderId,
      _currentImageUrl_tempLogoFooterId,
      _currentImageId_tempLogoFooterId,
      _removedImageIds,
      tempLogoHeaderId,
      tempLogoFooterId,
      ...rest
    } = data;

    const payload: Record<string, any> = { ...rest };

    if (tempLogoHeaderId) {
      payload['tempLogoHeaderId'] = tempLogoHeaderId;
    }
    const removedHeaderId = (_removedImageIds as Record<string, string>)?.[
      'tempLogoHeaderId'
    ];
    if (!tempLogoHeaderId && removedHeaderId) {
      payload['removedLogoHeaderId'] = removedHeaderId;
    }

    if (tempLogoFooterId) {
      payload['tempLogoFooterId'] = tempLogoFooterId;
    }
    const removedFooterId = (_removedImageIds as Record<string, string>)?.[
      'tempLogoFooterId'
    ];
    if (!tempLogoFooterId && removedFooterId) {
      payload['removedLogoFooterId'] = removedFooterId;
    }

    this.store.update(payload, () => {
      const form = this.formDynamic();

      const stepperInstance = form?.stepper();

      if (stepperInstance) stepperInstance.value.set(1);
    });
  }
}
