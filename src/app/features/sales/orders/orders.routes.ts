import { Routes } from '@angular/router';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderFormComponent } from './pages/order-form/order-form.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

export const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Pedidos' },
    children: [
      {
        path: '',
        component: OrderListComponent,
        title: 'Pedidos',
      },
      {
        path: ':id',
        component: OrderDetailComponent,
        title: 'Detalle del pedido',
        data: { breadcrumb: 'Detalle' },
      },
      {
        path: 'nuevo',
        component: OrderFormComponent,
        title: 'Nueva orden',
        data: { breadcrumb: 'Nuevo' },
      },
      {
        path: ':id/editar',
        component: OrderFormComponent,
        title: 'Editar orden',
        data: { breadcrumb: 'Editar' },
      },
    ],
  },
];
