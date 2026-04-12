import { Component, computed, inject } from '@angular/core';
import { BreadcrumbService } from '../../../services/ui/breadcrumb.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);

  readonly home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/dashboard',
    ariaLabel: 'Inicio',
  };

  readonly items = computed<MenuItem[]>(() => {
    const crumbs = this.breadcrumbService.breadcrumbs();
    return crumbs.map((crumb) => ({
      label: crumb.label,
      ...(crumb.route ? { routerLink: crumb.route } : { disabled: true }),
    }));
  });
}
