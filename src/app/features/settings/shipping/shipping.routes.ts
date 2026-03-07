import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Despacho' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/shipping-list/shipping-list.component').then(
            (m) => m.ShippingListComponent,
          ),
        title: 'Despacho',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/shipping-form/shipping-form.component').then(
            (m) => m.ShippingFormComponent,
          ),
        title: 'Nuevo despacho',
        data: { breadcrumb: 'Nuevo' },
      },
    ],
  },
];
