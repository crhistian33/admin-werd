import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavToggleService } from '../../../services/ui/nav-toggle.service';
import { TooltipModule } from 'primeng/tooltip';
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

    // Grupo Ventas: Gestión de transacciones y base de datos
    {
      label: 'Ventas',
      icon: 'shopping-bag',
      route: '/ventas',
      children: [
        { label: 'Pedidos', icon: 'clipboard-list', route: '/ventas/pedidos' }, // Cambiado: ícono de gestión
        { label: 'Clientes', icon: 'users', route: '/ventas/clientes' }, // El original de tu captura
      ],
    },

    // Grupo Catálogo: Gestión de inventario
    {
      label: 'Catálogo',
      icon: 'book-open',
      children: [
        { label: 'Productos', icon: 'package', route: '/products' },
        { label: 'Categorías', icon: 'layers', route: '/categories' },
        { label: 'Marcas', icon: 'tag', route: '/brands' },
      ],
    },

    // Grupo Marketing/Contenido: Lo que el cliente ve en la web
    {
      label: 'Marketing',
      icon: 'megaphone',
      children: [
        { label: 'Promociones', icon: 'ticket-percent', route: '/promotions' },
        { label: 'Novedades', icon: 'monitor-smartphone', route: '/news' },
        { label: 'Reseñas', icon: 'message-square-quote', route: '/reviews' },
      ],
    },
  ];

  navItemsConfig: NavItem[] = [
    { label: 'Usuarios', icon: 'user-cog', route: '/usuarios' },
    { label: 'Roles', icon: 'shield-check', route: '/roles' },
    { label: 'Tipos de pago', icon: 'wallet', route: '/tipos-pago' },
    { label: 'Zonas de envío', icon: 'truck', route: '/zonas-envio' },
    { label: 'Configuración', icon: 'settings', route: '/configuracion' },
  ];

  getChildren(item: NavItem) {
    // if (item.label === this.titleSubnav || !this.nav.isSubNav())
    //   this.nav.toggleSubNav();
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
    this.titleSubnav = '';
    this.children = [];
  }
}
