import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Reportes' },
    children: [
      {
        path: 'ventas',
        loadComponent: () =>
          import('./pages/sales-report/sales-report.component').then(
            (m) => m.SalesReportComponent,
          ),
        title: 'Reporte de ventas',
        data: { breadcrumb: 'Ventas' },
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/inventary-report/inventary-report.component').then(
            (m) => m.InventaryReportComponent,
          ),
        title: 'Reporte de inventario',
        data: { breadcrumb: 'Inventario' },
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/customers-report/customers-report.component').then(
            (m) => m.CustomersReportComponent,
          ),
        title: 'Reporte de clientes',
        data: { breadcrumb: 'Clientes' },
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/products-report/products-report.component').then(
            (m) => m.ProductsReportComponent,
          ),
        title: 'Reporte de productos',
        data: { breadcrumb: 'Productos' },
      },
    ],
  },
];
