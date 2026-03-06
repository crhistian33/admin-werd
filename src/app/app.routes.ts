import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
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
        children: [
          {
            path: 'pedidos',
            data: { breadcrumb: 'Pedidos' },
            loadChildren: () =>
              import('./features/sales/orders/orders.routes').then(
                (m) => m.routes,
              ),
          },
          {
            path: 'clientes',
            loadChildren: () =>
              import('./features/sales/customers/customers.routes').then(
                (m) => m.routes,
              ),
          },
          {
            path: '',
            redirectTo: 'pedidos',
            pathMatch: 'full',
          },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
