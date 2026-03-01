import { Component, inject } from '@angular/core';
import { NavToggleService } from '../../../services/ui/nav-toggle.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  nav = inject(NavToggleService);
}
