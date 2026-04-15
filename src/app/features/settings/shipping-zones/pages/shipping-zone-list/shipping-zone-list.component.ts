import { Component, inject } from '@angular/core';
import { ShippingZoneStore } from '../../store/shipping-zone.store';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { LucideAngularModule } from 'lucide-angular';
import { ShippingZoneActiveComponent } from '../../components/shipping-zone-active/shipping-zone-active.component';
import { ShippingZoneTrashComponent } from '../../components/shipping-zone-trash/shipping-zone-trash.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-shipping-zone-list',
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    ShippingZoneActiveComponent,
    ShippingZoneTrashComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './shipping-zone-list.component.html',
  styleUrl: './shipping-zone-list.component.scss',
})
export class ShippingZoneListComponent {
  readonly store = inject(ShippingZoneStore);
}
