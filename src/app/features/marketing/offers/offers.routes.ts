import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Promociones' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/offer-list/offer-list.component').then(
            (m) => m.OfferListComponent,
          ),
        title: 'Promociones',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/offer-form/offer-form.component').then(
            (m) => m.OfferFormComponent,
          ),
        title: 'Nueva promocion',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/offer-form/offer-form.component').then(
            (m) => m.OfferFormComponent,
          ),
        title: 'Editar promocion',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/offer-detail/offer-detail.component').then(
            (m) => m.OfferDetailComponent,
          ),
        title: 'Detalle de la promocion',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
