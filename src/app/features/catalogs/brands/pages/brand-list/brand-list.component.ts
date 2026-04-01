import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TabsModule } from 'primeng/tabs';
import { BrandStore } from '../../store/brand.store';
import { BadgeModule } from 'primeng/badge';
import { BrandsActiveComponent } from '../../components/brands-active/brands-active.component';
import { BrandsTrashComponent } from '../../components/brands-trash/brands-trash.component';

@Component({
  selector: 'app-brand-list',
  imports: [
    TabsModule,
    LucideAngularModule,
    BadgeModule,
    BrandsActiveComponent,
    BrandsTrashComponent,
  ],
  providers: [BrandStore],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss',
})
export class BrandListComponent {
  readonly store = inject(BrandStore);
}
