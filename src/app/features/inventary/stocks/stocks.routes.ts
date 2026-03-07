import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Stocks' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/stock-list/stock-list.component').then(
            (m) => m.StockListComponent,
          ),
        title: 'Stocks',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/stock-detail/stock-detail.component').then(
            (m) => m.StockDetailComponent,
          ),
        title: 'Detalle de Stock',
        data: { breadcrumb: 'Detalle' },
      },
    ],
  },
];
