import { Component, input, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-filter-drawer',
  imports: [DrawerModule, ButtonModule],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.scss',
})
export class FilterDrawerComponent {
  readonly visible = model<boolean>(false);
  readonly onClear = input.required<() => void>();
}
