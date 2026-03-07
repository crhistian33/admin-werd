import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Cupones' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/voucher-list/voucher-list.component').then(
            (m) => m.VoucherListComponent,
          ),
        title: 'Cupones',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/voucher-form/voucher-form.component').then(
            (m) => m.VoucherFormComponent,
          ),
        title: 'Nuevo cupon',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/voucher-form/voucher-form.component').then(
            (m) => m.VoucherFormComponent,
          ),
        title: 'Editar cupon',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/voucher-detail/voucher-detail.component').then(
            (m) => m.VoucherDetailComponent,
          ),
        title: 'Detalle del cupon',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
