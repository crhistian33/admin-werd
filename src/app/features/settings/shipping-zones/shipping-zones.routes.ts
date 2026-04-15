import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Zonas de envío' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/shipping-zone-list/shipping-zone-list.component').then(
            (m) => m.ShippingZoneListComponent,
          ),
        title: 'Zonas de envío',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/shipping-zone-form/shipping-zone-form.component').then(
            (m) => m.ShippingZoneFormComponent,
          ),
        title: 'Nueva zona de envío',
        data: { breadcrumb: 'Nueva' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/shipping-zone-form/shipping-zone-form.component').then(
            (m) => m.ShippingZoneFormComponent,
          ),
        title: 'Editar zona de envío',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/shipping-zone-detail/shipping-zone-detail.component').then(
            (m) => m.ShippingZoneDetailComponent,
          ),
        title: 'Detalle de zona de envío',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
