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
    path: 'zonas-envio',
    loadChildren: () =>
      import('./shipping-zones/shipping-zones.routes').then((m) => m.routes),
  },
];
