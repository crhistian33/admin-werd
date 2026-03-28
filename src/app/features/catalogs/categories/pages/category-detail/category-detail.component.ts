import { Component, inject, input } from '@angular/core';
import { CategoryStore } from '../../store/category.store';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DialogService } from '@shared/services/ui/dialog.service';
import { CardModule } from 'primeng/card';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '@env/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  imports: [
    ButtonModule,
    SkeletonModule,
    TagModule,
    CardModule,
    LucideAngularModule,
    DatePipe,
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent {
  readonly store = inject(CategoryStore);
  private dialog = inject(DialogService);
  private router = inject(Router);

  id = input.required<string>();

  readonly apiURL = environment.apiImagesUrl;

  goBack = () => this.router.navigate(['/catalogos/categorias']);
  edit = () =>
    this.router.navigate(['/catalogos/categorias', this.id(), 'editar']);

  ngOnInit() {
    this.store.getById(this.id());
  }

  onDelete(): void {
    const category = this.store.selected();
    if (!category || !category.id) return;
    this.dialog.delete({
      message: `¿Está seguro de eliminar la categoría <strong>${category.name}</strong>?. <br>No se podrá reestablecer la acción`,
      onAccept: () => {
        this.store.delete(category.id);
        this.dialog.success(
          `Categoría ${this.store.selected()?.name} eliminada`,
          'Eliminación exitosa',
        );
        this.router.navigate(['/catalogos/categorias']);
      },
    });
  }
}
