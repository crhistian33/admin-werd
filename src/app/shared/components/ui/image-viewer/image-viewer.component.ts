import { Component, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  readonly visible = model(false);
  readonly src = input.required<string>();
  readonly alt = input<string>('Evidencia');

  protected onHide(): void {
    this.visible.set(false);
  }
}
