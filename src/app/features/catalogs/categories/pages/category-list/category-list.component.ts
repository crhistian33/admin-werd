import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryStore } from '../../store/category.store';
import { CategoriesActiveComponent } from '../../components/categories-active/categories-active.component';
import { CategoriesTrashComponent } from '../../components/categories-trash/categories-trash.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    CategoriesActiveComponent,
    CategoriesTrashComponent,
    ProgressSpinnerModule,
  ],
  providers: [CategoryStore],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent {
  readonly store = inject(CategoryStore);
}
