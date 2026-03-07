import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Pedidos' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/order-list/order-list.component').then(
            (m) => m.OrderListComponent,
          ),
        title: 'Pedidos',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/order-form/order-form.component').then(
            (m) => m.OrderFormComponent,
          ),
        title: 'Nueva orden',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/order-form/order-form.component').then(
            (m) => m.OrderFormComponent,
          ),
        title: 'Editar orden',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/order-detail/order-detail.component').then(
            (m) => m.OrderDetailComponent,
          ),
        title: 'Detalle del pedido',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
