import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { HeroSlideActiveComponent } from '../../components/hero-slide-active/hero-slide-active.component';
import { HeroSlideTrashComponent } from '../../components/hero-slide-trash/hero-slide-trash.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeroSlideStore } from '../../store/hero-slide.store';

@Component({
  selector: 'app-slide-list',
  imports: [
    TabsModule,
    BadgeModule,
    LucideAngularModule,
    HeroSlideActiveComponent,
    HeroSlideTrashComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './slide-list.component.html',
  styleUrl: './slide-list.component.scss',
})
export class SlideListComponent {
  readonly store = inject(HeroSlideStore);
}
