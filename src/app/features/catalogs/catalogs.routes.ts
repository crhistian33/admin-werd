import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full',
  },
  {
    path: 'productos',
    loadChildren: () =>
      import('./products/products.routes').then((m) => m.routes),
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./categories/categories.routes').then((m) => m.routes),
  },
  {
    path: 'marcas',
    loadChildren: () => import('./brands/brands.routes').then((m) => m.routes),
  },
  {
    path: 'resenas',
    loadChildren: () =>
      import('./reviews/reviews.routes').then((m) => m.routes),
  },
];
