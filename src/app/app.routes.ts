import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/home/home.component').then(
            (m) => m.HomeComponent,
          ),
        data: { title: 'Dashboard' },
      },
      {
        path: 'ventas',
        children: [
          {
            path: 'pedidos',
            loadChildren: () =>
              import('./features/sales/orders/orders.routes').then(
                (m) => m.routes,
              ),
            data: { title: 'Pedidos' },
          },
          {
            path: 'clientes',
            loadChildren: () =>
              import('./features/sales/customers/customers.routes').then(
                (m) => m.routes,
              ),
            data: { title: 'Clientes' },
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
