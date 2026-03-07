import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Roles' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/role-list/role-list.component').then(
            (m) => m.RoleListComponent,
          ),
        title: 'Roles',
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/role-form/role-form.component').then(
            (m) => m.RoleFormComponent,
          ),
        title: 'Nuevo Rol',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/role-form/role-form.component').then(
            (m) => m.RoleFormComponent,
          ),
        title: 'Editar Rol',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/role-detail/role-detail.component').then(
            (m) => m.RoleDetailComponent,
          ),
        title: 'Detalle de Rol',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
