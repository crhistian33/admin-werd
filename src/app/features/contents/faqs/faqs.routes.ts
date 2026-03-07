import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Preguntas frecuentes' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/faq-list/faq-list.component').then(
            (m) => m.FaqListComponent,
          ),
        title: 'Preguntas frecuentes',
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/faq-form/faq-form.component').then(
            (m) => m.FaqFormComponent,
          ),
        title: 'Nueva pregunta',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/faq-form/faq-form.component').then(
            (m) => m.FaqFormComponent,
          ),
        title: 'Editar pregunta',
        data: { breadcrumb: 'Editar' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/faq-detail/faq-detail.component').then(
            (m) => m.FaqDetailComponent,
          ),
        title: 'Detalle de la pregunta',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
