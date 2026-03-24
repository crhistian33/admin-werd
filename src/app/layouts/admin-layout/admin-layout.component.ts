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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageTitleService } from '@shared/services/ui/page-title.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { Store } from '@ngxs/store';
import { AuthState } from '@core/auth/store/auth.state';

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
    ConfirmDialogModule,
    ProgressBarModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly nav = inject(NavToggleService);
  readonly pageTitle = inject(PageTitleService);
  readonly store = inject(Store);

  isCollapsed = this.nav.isCollapsed;
  isMobileVisible = this.nav.isMobileVisible;

  readonly isLoading = this.store.selectSignal(AuthState.isLoading);
}
