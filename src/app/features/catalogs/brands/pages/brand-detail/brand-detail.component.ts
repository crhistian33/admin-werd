import { Component, inject, input } from '@angular/core';
import { BrandStore } from '../../store/brand.store';
import { DialogService } from '@shared/services/ui/dialog.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-brand-detail',
  imports: [
    ButtonModule,
    SkeletonModule,
    TagModule,
    CardModule,
    LucideAngularModule,
  ],
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.scss',
})
export class BrandDetailComponent {
  readonly store = inject(BrandStore);
  private dialog = inject(DialogService);
  private router = inject(Router);

  id = input.required<number>();

  goBack = () => this.router.navigate(['/catalogos/marcas']);
  edit = () => this.router.navigate(['/catalogos/marcas', this.id(), 'editar']);

  ngOnInit() {
    this.store.getById(this.id());
  }

  onDelete(): void {
    const category = this.store.selected();
    if (!category || !category.id) return;
    this.dialog.delete({
      message: `¿Está seguro de eliminar la marca <strong>${category.name}</strong>?. <br>No se podrá reestablecer la acción`,
      onAccept: () => {
        this.store.delete(category.id);
        this.dialog.success(
          `Marca ${this.store.selected()?.name} eliminada`,
          'Eliminación exitosa',
        );
        this.router.navigate(['/catalogos/marcas']);
      },
    });
  }
}
