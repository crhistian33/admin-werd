import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Métodos de pago' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/payment-method-list/payment-method-list.component').then(
            (m) => m.PaymentMethodListComponent,
          ),
        title: 'Métodos de pago',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/payment-method-form/payment-method-form.component').then(
            (m) => m.PaymentMethodFormComponent,
          ),
        title: 'Nuevo método de pago',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/payment-method-form/payment-method-form.component').then(
            (m) => m.PaymentMethodFormComponent,
          ),
        title: 'Editar método de pago',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/payment-method-detail/payment-method-detail.component').then(
            (m) => m.PaymentMethodDetailComponent,
          ),
        title: 'Detalle del método de pago',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
