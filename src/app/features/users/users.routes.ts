import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cuentas',
    pathMatch: 'full',
  },
  {
    path: 'cuentas',
    data: { breadcrumb: 'Cuentas' },
    loadChildren: () =>
      import('./accounts/accounts.routes').then((m) => m.routes),
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.routes').then((m) => m.routes),
  },
];
