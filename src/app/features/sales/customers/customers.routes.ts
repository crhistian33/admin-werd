import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Clientes' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/customer-list/customer-list.component').then(
            (m) => m.CustomerListComponent,
          ),
        title: 'Clientes',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/customer-detail/customer-detail.component').then(
            (m) => m.CustomerDetailComponent,
          ),
        title: 'Detalle de Cliente',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
