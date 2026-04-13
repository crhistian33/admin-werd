import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'general',
    pathMatch: 'full',
  },
  {
    path: 'general',
    data: { breadcrumb: 'General' },
    loadChildren: () =>
      import('./general/general.routes').then((m) => m.routes),
  },
  {
    path: 'metodos-pago',
    loadChildren: () =>
      import('./payment-methods/payment-methods.routes').then((m) => m.routes),
  },
  {
    path: 'despacho',
    loadChildren: () =>
      import('./shipping/shipping.routes').then((m) => m.routes),
  },
];
