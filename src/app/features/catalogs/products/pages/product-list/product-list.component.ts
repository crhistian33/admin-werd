import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { LucideAngularModule } from 'lucide-angular';
import { ProductStore } from '../../store/product.store';
import { ProductsActiveComponent } from '../../components/products-active/products-active.component';
import { ProductsTrashComponent } from '../../components/products-trash/products-trash.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-product-list',
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    ProductsActiveComponent,
    ProductsTrashComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  readonly store = inject(ProductStore);
}
