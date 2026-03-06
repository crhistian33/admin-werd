import { Injectable, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { BreadcrumbItem } from '../../types/breadcrumb.type';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  readonly breadcrumbs = signal<BreadcrumbItem[]>([]);

  constructor() {
    // Construye en el siguiente tick para rutas lazy
    Promise.resolve().then(() => this.breadcrumbs.set(this.build()));

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.breadcrumbs.set(this.build()));
  }

  private build(): BreadcrumbItem[] {
    const crumbs: BreadcrumbItem[] = [];
    let route: ActivatedRouteSnapshot | null =
      this.router.routerState.snapshot.root;
    let url = '';

    while (route) {
      const segment = route.url.map((s) => s.path).join('/');
      if (segment) url += `/${segment}`;

      // routeConfig.data evita heredar data de rutas padre
      const data = route.routeConfig?.data ?? {};
      const label: string | undefined = data['breadcrumb'];
      const isGroup: boolean = data['breadcrumbGroup'] ?? false;
      const lastLabel = crumbs.at(-1)?.label;

      if (label && label !== lastLabel) {
        crumbs.push({
          label,
          route: isGroup ? undefined : url || '/',
        });
      }

      route = route.children.find((c) => c.outlet === 'primary') ?? null;
    }

    // Sin breadcrumbs en dashboard o raíz
    if (crumbs.length <= 1) return [];

    // Último item sin ruta — es la página activa
    crumbs[crumbs.length - 1] = {
      label: crumbs.at(-1)!.label,
      route: undefined,
    };

    return crumbs;
  }

  setLastLabel(label: string): void {
    const current = this.breadcrumbs();
    if (!current.length) return;

    const updated = [...current];
    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      label,
    };

    this.breadcrumbs.set(updated);
  }
}
