import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NavToggleService } from '@shared/services/ui/nav-toggle.service';
import { PageTitleService } from '@shared/services/ui/page-title.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  nav = inject(NavToggleService);
  pageTitle = inject(PageTitleService);
}
