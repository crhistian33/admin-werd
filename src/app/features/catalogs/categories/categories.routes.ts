import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Categorías' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/category-list/category-list.component').then(
            (m) => m.CategoryListComponent,
          ),
        title: 'Categorías',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/category-form/category-form.component').then(
            (m) => m.CategoryFormComponent,
          ),
        title: 'Nueva Categoría',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/category-form/category-form.component').then(
            (m) => m.CategoryFormComponent,
          ),
        title: 'Editar Categoría',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/category-detail/category-detail.component').then(
            (m) => m.CategoryDetailComponent,
          ),
        title: 'Detalle de Categoría',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
