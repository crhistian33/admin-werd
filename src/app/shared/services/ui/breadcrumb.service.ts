import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import type { BreadcrumbItem } from '../../types/breadcrumb.type';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      // Usamos el snapshot para asegurar que la construcción sea limpia
      map(() => this.build(this.activatedRoute.root)),
    ),
    { initialValue: [] as BreadcrumbItem[] },
  );

  private build(
    route: ActivatedRoute,
    url = '',
    crumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return crumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      // Actualizamos la URL solo si hay segmento, evitando slashes dobles
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      const label = child.snapshot.data['breadcrumb'];
      // Solo agregamos si hay label y no es el mismo que el anterior (evita duplicados de redirección)
      if (
        label &&
        (!crumbs.length || crumbs[crumbs.length - 1].label !== label)
      ) {
        crumbs.push({
          label,
          // Si es breadcrumbGroup no le ponemos ruta para que el componente lo deshabilite
          route: child.snapshot.data['breadcrumbGroup'] ? undefined : nextUrl,
        });
      }

      return this.build(child, nextUrl, crumbs);
    }

    return crumbs;
  }
}
