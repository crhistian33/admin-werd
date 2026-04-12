import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Destacados' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/slide-list/slide-list.component').then(
            (m) => m.SlideListComponent,
          ),
        title: 'Destacados',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/slide-form/slide-form.component').then(
            (m) => m.SlideFormComponent,
          ),
        title: 'Nuevo destacado',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/slide-form/slide-form.component').then(
            (m) => m.SlideFormComponent,
          ),
        title: 'Editar destacado',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/slide-detail/slide-detail.component').then(
            (m) => m.SlideDetailComponent,
          ),
        title: 'Detalle del destacado',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
