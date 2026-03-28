import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
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
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  readonly router = inject(Router);

  readonly mainContent =
    viewChild.required<ElementRef<HTMLElement>>('mainContent');

  isCollapsed = this.nav.isCollapsed;
  isMobileVisible = this.nav.isMobileVisible;

  readonly isLoading = this.store.selectSignal(AuthState.isLoading);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.mainContent().nativeElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
  }
}
