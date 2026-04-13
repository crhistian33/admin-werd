export interface SocialLink {
  id?: string;
  network: string;
  name: string;
  icon?: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
}
