import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'destacados',
    pathMatch: 'full',
  },
  {
    path: 'destacados',
    loadChildren: () =>
      import('./sliders/sliders.routes').then((m) => m.routes),
  },
  {
    path: 'paginas-internas',
    loadChildren: () =>
      import('./staticpages/staticpages.routes').then((m) => m.routes),
  },
  {
    path: 'preguntas-frecuentes',
    loadChildren: () => import('./faqs/faqs.routes').then((m) => m.routes),
  },
];
