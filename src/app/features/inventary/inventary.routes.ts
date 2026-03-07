import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'stocks',
    pathMatch: 'full',
  },
  {
    path: 'stocks',
    loadChildren: () => import('./stocks/stocks.routes').then((m) => m.routes),
  },
  {
    path: 'movimientos',
    loadChildren: () =>
      import('./movements/movements.routes').then((m) => m.routes),
  },
];
