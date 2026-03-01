import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  CircleUserIcon,
  ClipboardList,
  EllipsisVertical,
  Layers,
  LayoutDashboard,
  LogOut,
  LucideAngularModule,
  Megaphone,
  Menu,
  MessageSquareQuote,
  MonitorSmartphone,
  MoveLeft,
  MoveRight,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Tag,
  TicketPercent,
  Truck,
  UserCog,
  Users,
  Wallet,
  X,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.none',
        },
      },
    }),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        Package,
        Tag,
        Users,
        LogOut,
        ChevronRight,
        ChevronLeft,
        Menu,
        X,
        CircleUser,
        CircleUserIcon,
        EllipsisVertical,
        ShoppingBag,
        Wallet,
        Settings,
        Layers,
        UserCog,
        ShieldCheck,
        TicketPercent,
        MonitorSmartphone,
        MessageSquareQuote,
        Truck,
        BookOpen,
        ClipboardList,
        Megaphone,
        MoveRight,
        MoveLeft,
        ArrowLeft,
      }),
    ),
  ],
};
