import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Marcas' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/brand-list/brand-list.component').then(
            (m) => m.BrandListComponent,
          ),
        title: 'Marcas',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent,
          ),
        title: 'Nueva Marca',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/brand-form/brand-form.component').then(
            (m) => m.BrandFormComponent,
          ),
        title: 'Editar Marca',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/brand-detail/brand-detail.component').then(
            (m) => m.BrandDetailComponent,
          ),
        title: 'Detalle de Marca',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
