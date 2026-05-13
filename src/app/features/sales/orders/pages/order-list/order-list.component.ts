import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { LucideAngularModule } from 'lucide-angular';

import { OrderStore } from '../../store/order.store';
import { OrderActivesTableComponent } from '../../components/tables/order-actives-table/order-actives-table.component';
import { OrderClaimsTableComponent } from '../../components/tables/order-claims-table/order-claims-table.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    OrderActivesTableComponent,
    OrderClaimsTableComponent,
  ],
  providers: [OrderStore],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent {
  readonly store = inject(OrderStore);
}
