import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Reseñas' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/review-list/review-list.component').then(
            (m) => m.ReviewListComponent,
          ),
        title: 'Reseñas',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/review-detail/review-detail.component').then(
            (m) => m.ReviewDetailComponent,
          ),
        title: 'Detalle de Reseña',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
