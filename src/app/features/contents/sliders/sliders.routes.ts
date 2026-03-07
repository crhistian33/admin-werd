import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Destacados' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/slider-list/slider-list.component').then(
            (m) => m.SliderListComponent,
          ),
        title: 'Destacados',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/slider-form/slider-form.component').then(
            (m) => m.SliderFormComponent,
          ),
        title: 'Nuevo destacado',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/slider-form/slider-form.component').then(
            (m) => m.SliderFormComponent,
          ),
        title: 'Editar destacado',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/slider-detail/slider-detail.component').then(
            (m) => m.SliderDetailComponent,
          ),
        title: 'Detalle del destacado',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
