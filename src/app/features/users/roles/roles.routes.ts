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
    ],
  },
];
