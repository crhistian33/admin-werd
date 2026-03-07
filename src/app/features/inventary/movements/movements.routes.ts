import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Movimientos' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/movement-list/movement-list.component').then(
            (m) => m.MovementListComponent,
          ),
        title: 'Movimientos',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/movement-detail/movement-detail.component').then(
            (m) => m.MovementDetailComponent,
          ),
        title: 'Detalle de Movimiento',
        data: { breadcrumb: 'Detalle' },
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/movement-form/movement-form.component').then(
            (m) => m.MovementFormComponent,
          ),
        title: 'Nuevo Movimiento',
        data: { breadcrumb: 'Nuevo' },
      },
    ],
  },
];
