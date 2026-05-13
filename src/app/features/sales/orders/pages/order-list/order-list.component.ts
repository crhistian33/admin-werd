import { Component, inject, input, OnInit, signal } from '@angular/core';
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
export class OrderListComponent implements OnInit {
  readonly store = inject(OrderStore);

  readonly tab = input<string>();

  readonly activeTab = signal<string>('0');

  ngOnInit(): void {
    this.activeTab.set(this.tab() ?? '0');
  }
}
