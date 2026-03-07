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
        path: 'new',
        loadComponent: () =>
          import('./pages/customer-form/customer-form.component').then(
            (m) => m.CustomerFormComponent,
          ),
        title: 'Nuevo Cliente',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/customer-form/customer-form.component').then(
            (m) => m.CustomerFormComponent,
          ),
        title: 'Editar Cliente',
        data: { breadcrumb: 'Editar' },
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
