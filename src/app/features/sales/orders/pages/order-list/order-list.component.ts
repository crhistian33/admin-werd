import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { LucideAngularModule } from 'lucide-angular';

import { OrderStore } from '../../store/order.store';
import { OrdersActiveComponent } from '../../components/orders-active/orders-active.component';
import { ClaimsListComponent } from '../../components/claims-list/claims-list.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    OrdersActiveComponent,
    ClaimsListComponent,
  ],
  providers: [OrderStore],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent {
  readonly store = inject(OrderStore);
}
