import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { LucideAngularModule } from 'lucide-angular';
import { CustomerStore } from '../../store/customer.store';
import { CustomerActiveComponent } from '../../components/customer-active/customer-active.component';
import { CustomerTrashComponent } from '../../components/customer-trash/customer-trash.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    CustomerActiveComponent,
    CustomerTrashComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent {
  readonly store = inject(CustomerStore);
}
