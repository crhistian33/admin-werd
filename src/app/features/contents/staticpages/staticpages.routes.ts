import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Páginas internas' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/staticpage-list/staticpage-list.component').then(
            (m) => m.StaticpageListComponent,
          ),
        title: 'Páginas internas',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/staticpage-form/staticpage-form.component').then(
            (m) => m.StaticpageFormComponent,
          ),
        title: 'Nueva página',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/staticpage-form/staticpage-form.component').then(
            (m) => m.StaticpageFormComponent,
          ),
        title: 'Editar página',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/staticpage-detail/staticpage-detail.component').then(
            (m) => m.StaticpageDetailComponent,
          ),
        title: 'Detalle de la página',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
