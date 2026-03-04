import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule } from 'lucide-angular';
import { NavComponent } from '@shared/components/common/nav/nav.component';
import { NavToggleService } from '@shared/services/ui/nav-toggle.service';
import { HeaderComponent } from '@shared/components/common/header/header.component';
import { BreadcrumbComponent } from '@shared/components/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterModule,
    DrawerModule,
    ButtonModule,
    LucideAngularModule,
    NavComponent,
    HeaderComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly nav = inject(NavToggleService);

  isCollapsed = this.nav.isCollapsed;
  isMobileVisible = this.nav.isMobileVisible;
}
