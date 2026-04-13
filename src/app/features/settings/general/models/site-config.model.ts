import { SocialLink } from './social-link.model';

export interface SiteConfig {
  id: string;
  storeName: string;
  storeEmail: string;
  supportEmail?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  whatsappNumber?: string;
  address?: string;
  currency: string;
  taxRate: number;
  metaTitle?: string;
  metaDescription?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  updatedAt: string;
  socialLinks: SocialLink[];
  images?: any[];
}
