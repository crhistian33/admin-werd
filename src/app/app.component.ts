import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'admin-werd';
}
