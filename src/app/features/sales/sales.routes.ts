import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pedidos',
    pathMatch: 'full',
  },
  {
    path: 'pedidos',
    data: { breadcrumb: 'Pedidos' },
    loadChildren: () => import('./orders/orders.routes').then((m) => m.routes),
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./customers/customers.routes').then((m) => m.routes),
  },
];
