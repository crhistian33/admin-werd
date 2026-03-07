import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Cuentas' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/account-list/account-list.component').then(
            (m) => m.AccountListComponent,
          ),
        title: 'Cuentas',
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/account-form/account-form.component').then(
            (m) => m.AccountFormComponent,
          ),
        title: 'Nueva Cuenta',
        data: { breadcrumb: 'Nueva' },
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/account-form/account-form.component').then(
            (m) => m.AccountFormComponent,
          ),
        title: 'Editar Cuenta',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/account-detail/account-detail.component').then(
            (m) => m.AccountDetailComponent,
          ),
        title: 'Detalle de Cuenta',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
