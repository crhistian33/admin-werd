import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Productos' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
        title: 'Productos',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
        title: 'Nuevo Producto',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
        title: 'Editar Producto',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent,
          ),
        title: 'Detalle de Producto',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
