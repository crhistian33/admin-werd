import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    title: 'Pedidos',
    data: { breadcrumb: 'Pedidos' },
  },
];
