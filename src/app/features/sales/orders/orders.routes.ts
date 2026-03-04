import { Routes } from '@angular/router';
import { OrderListComponent } from './pages/order-list/order-list.component';

export const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    title: 'Pedidos',
    data: { breadcrumb: 'Pedidos' },
  },
];
