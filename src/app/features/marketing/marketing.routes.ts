import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'promociones',
    pathMatch: 'full',
  },
  {
    path: 'promociones',
    loadChildren: () => import('./offers/offers.routes').then((m) => m.routes),
  },
  {
    path: 'cupones',
    loadChildren: () =>
      import('./vouchers/vouchers.routes').then((m) => m.routes),
  },
];
