import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NavToggleService } from '@shared/services/ui/nav-toggle.service';
import { PageTitleService } from '@shared/services/ui/page-title.service';
import { Store } from '@ngxs/store';
import { AuthState } from '@core/auth/store/auth.state';
import { AuthActions } from '@core/auth/store/auth.actions';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    LucideAngularModule,
    MenuModule,
    AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  nav = inject(NavToggleService);
  pageTitle = inject(PageTitleService);
  readonly store = inject(Store);

  readonly user = this.store.selectSignal(AuthState.admin);
  readonly isLoading = this.store.selectSignal(AuthState.isLoading);

  readonly menuItems: MenuItem[] = [
    {
      items: [
        {
          label: 'Mi Cuenta',
          routerLink: '/usuarios/perfil',
          disabled: this.isLoading(),
        },
        {
          separator: true, // <--- Esta es la línea divisoria
        },
        {
          label: 'Cerrar sesión',
          id: 'logout-item',
          command: () => this.onLogout(),
          disabled: this.isLoading(),
        },
      ],
    },
  ];

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
