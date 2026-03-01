import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavToggleService {
  private router = inject(Router);

  isCollapsed = signal(true);
  isMobileVisible = signal(false);
  isSubNav = signal(false);
  activeParentRoute = signal<string | null>(null);

  private screenWidth = signal(window.innerWidth);
  isMobile = computed(() => this.screenWidth() < 768);

  constructor() {
    window.addEventListener('resize', () =>
      this.screenWidth.set(window.innerWidth),
    );

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        const parent = this.activeParentRoute();

        // Auto-cierre solo si salimos de la ruta padre
        if (parent && !url.startsWith(parent)) {
          this.isSubNav.set(false);
          this.activeParentRoute.set(null);
        }

        // En móvil, al navegar cerramos todo el drawer
        if (this.isMobile()) {
          this.isMobileVisible.set(false);
          this.isSubNav.set(false); // Reset para que al volver a abrir empiece en el main
        }
      });
  }

  toggleSidebar() {
    this.isMobile()
      ? this.isMobileVisible.update((v) => !v)
      : this.isCollapsed.update((v) => !v);
  }
}
