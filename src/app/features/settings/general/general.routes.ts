import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'General' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/general-form/general-form.component').then(
            (m) => m.GeneralFormComponent,
          ),
        title: 'General',
      },
    ],
  },
];
