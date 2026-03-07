import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Métodos de pago' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/pay-list/pay-list.component').then(
            (m) => m.PayListComponent,
          ),
        title: 'Métodos de pago',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/pay-detail/pay-detail.component').then(
            (m) => m.PayDetailComponent,
          ),
        title: 'Detalle del mpétodo de pago',
        data: { breadcrumb: 'Detalle' },
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/pay-form/pay-form.component').then(
            (m) => m.PayFormComponent,
          ),
        title: 'Nuevo método de pago',
        data: { breadcrumb: 'Nuevo' },
      },
    ],
  },
];
