import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { PagesActiveComponent } from '../../components/pages-active/pages-active.component';
import { PagesTrashComponent } from '../../components/pages-trash/pages-trash.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PageStore } from '../../store/page.store';

@Component({
  selector: 'app-staticpage-list',
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    PagesActiveComponent,
    PagesTrashComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './staticpage-list.component.html',
  styleUrl: './staticpage-list.component.scss',
})
export class StaticpageListComponent {
  readonly store = inject(PageStore);
}
