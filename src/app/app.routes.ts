import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard, guestGuard } from '@core/auth/guards/auth.guard';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/home/home.component').then(
            (m) => m.HomeComponent,
          ),
      },
      {
        path: 'ventas',
        data: {
          breadcrumb: 'Ventas',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/sales/sales.routes').then((m) => m.routes),
      },
      {
        path: 'catalogos',
        data: {
          breadcrumb: 'Catálogos',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/catalogs/catalogs.routes').then((m) => m.routes),
      },
      {
        path: 'inventario',
        data: {
          breadcrumb: 'Inventario',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/inventary/inventary.routes').then((m) => m.routes),
      },
      {
        path: 'marketing',
        data: {
          breadcrumb: 'Marketing',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/marketing/marketing.routes').then((m) => m.routes),
      },
      {
        path: 'contenidos',
        data: {
          breadcrumb: 'Contenidos',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/contents/contents.routes').then((m) => m.routes),
      },
      {
        path: 'reportes',
        data: {
          breadcrumb: 'Reportes',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/reports/reports.routes').then((m) => m.routes),
      },
      {
        path: 'usuarios',
        data: {
          breadcrumb: 'Usuarios',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/users/users.routes').then((m) => m.routes),
      },
      {
        path: 'configuraciones',
        data: {
          breadcrumb: 'Configuraciones',
          breadcrumbGroup: true, // ← sin ruta, solo agrupa
        },
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.routes),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
