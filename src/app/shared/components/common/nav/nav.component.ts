import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TooltipModule } from 'primeng/tooltip';

import { NavToggleService } from '../../../services/ui/nav-toggle.service';
import { NavItem } from '../../../types/nav-item.type';

@Component({
  selector: 'app-nav',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    TooltipModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  nav = inject(NavToggleService); // Inyectamos el servicio único
  router = inject(Router);

  children: NavItem[] = [];
  titleSubnav: string = '';

  // Definición de ítems de navegación para no repetir código
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard' },

    // Ventas
    {
      label: 'Ventas',
      icon: 'shopping-cart',
      route: '/ventas',
      children: [
        { label: 'Pedidos', icon: 'file-text', route: '/ventas/pedidos' },
        { label: 'Clientes', icon: 'users', route: '/ventas/clientes' },
      ],
    },

    // Catálogo
    {
      label: 'Catálogo',
      icon: 'layout-grid',
      route: '/catalogos',
      children: [
        { label: 'Productos', icon: 'package', route: '/catalogos/productos' },
        {
          label: 'Categorías',
          icon: 'folder-tree',
          route: '/catalogos/categorias',
        },
        { label: 'Marcas', icon: 'badge-check', route: '/catalogos/marcas' },
        { label: 'Reseñas', icon: 'star', route: '/catalogos/resenas' },
      ],
    },

    // Inventario
    {
      label: 'Inventario',
      icon: 'warehouse',
      route: '/inventario',
      children: [
        {
          label: 'Control de stocks',
          icon: 'boxes',
          route: '/inventario/stocks',
        },
        {
          label: 'Movimientos',
          icon: 'arrow-left-right',
          route: '/inventario/movimientos',
        },
      ],
    },

    // Marketing
    {
      label: 'Marketing',
      icon: 'megaphone',
      route: '/marketing',
      children: [
        {
          label: 'Promociones',
          icon: 'ticket-percent',
          route: '/marketing/promociones',
        },
        { label: 'Cupones', icon: 'ticket', route: '/marketing/cupones' },
      ],
    },

    // Contenidos
    {
      label: 'Contenidos',
      icon: 'book-open',
      route: '/contenidos',
      children: [
        { label: 'Destacados', icon: 'zap', route: '/contenidos/destacados' },
        {
          label: 'Páginas internas',
          icon: 'file-code',
          route: '/contenidos/paginas-internas',
        },
        {
          label: 'Preguntas frecuentes',
          icon: 'help-circle',
          route: '/contenidos/preguntas-frecuentes',
        },
      ],
    },

    // Reportes
    {
      label: 'Reportes',
      icon: 'chart-bar-stacked',
      route: '/reportes',
      children: [
        { label: 'Ventas', icon: 'trending-up', route: '/reportes/ventas' },
        {
          label: 'Inventario',
          icon: 'chart-bar',
          route: '/reportes/inventario',
        },
        { label: 'Clientes', icon: 'user-search', route: '/reportes/clientes' },
        {
          label: 'Productos',
          icon: 'package-search',
          route: '/reportes/productos',
        },
      ],
    },
  ];

  navItemsConfig: NavItem[] = [
    {
      label: 'Usuarios',
      icon: 'users',
      route: '/usuarios',
      children: [
        { label: 'Cuentas', icon: 'user-cog', route: '/usuarios/cuentas' },
        { label: 'Roles', icon: 'shield-check', route: '/usuarios/roles' },
      ],
    },
    {
      label: 'Configuraciones',
      icon: 'settings',
      route: '/configuraciones',
      children: [
        {
          label: 'General',
          icon: 'sliders-horizontal',
          route: '/configuraciones/general',
        },
        {
          label: 'Métodos de pago',
          icon: 'wallet',
          route: '/configuraciones/pagos',
        },
        {
          label: 'Despacho',
          icon: 'truck',
          route: '/configuraciones/despacho',
        },
      ],
    },
  ];

  getChildren(item: NavItem) {
    if (item.route) {
      this.nav.activeParentRoute.set(item.route);
    }

    this.nav.isSubNav.set(true);
    this.nav.isCollapsed.set(true);
    this.titleSubnav = item.label;
    this.children = item.children ?? [];
  }

  isRouteActive(route?: string): boolean {
    if (!route || route === '/') {
      return false;
    }

    // 2. Comparamos si la URL actual empieza con la ruta del item
    // Usamos includes o startsWith dependiendo de qué tan estricto quieras ser
    return this.router.url.includes(route);
  }

  closeSubNav() {
    this.nav.isSubNav.set(false);
    // this.titleSubnav = '';
    // this.children = [];
  }
}
