import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DetailDynamicComponent } from '@shared/components/ui/detail-dynamic/detail-dynamic.component';
import { DialogService } from '@shared/services/ui/dialog.service';
import { FaqStore } from '../../store/faq.store';
import { FAQ_DETAIL_CONFIG } from '../../config/faq-detail.config';

@Component({
  selector: 'app-faq-detail',
  imports: [DetailDynamicComponent],
  templateUrl: './faq-detail.component.html',
  styleUrl: './faq-detail.component.scss',
})
export class FaqDetailComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  readonly store = inject(FaqStore);

  readonly id = input.required<string>();

  readonly detailConfig = FAQ_DETAIL_CONFIG;

  ngOnInit(): void {
    this.store.getById(this.id());
  }

  goBack(): void {
    void this.router.navigate(['/contenidos/preguntas-frecuentes']);
  }

  goToEdit(): void {
    void this.router.navigate(
      ['/contenidos/preguntas-frecuentes', this.id(), 'editar'],
      {
        queryParams: { from: 'detail' },
      },
    );
  }

  onDelete(): void {
    const faq = this.store.selected();
    if (!faq) return;

    this.dialog.delete({
      message: `¿Eliminar <strong>${faq.question}</strong>?
                <br>Podrás recuperarlo desde la papelera.`,
      onAccept: () => {
        this.store.softDelete((faq as any).id, () => this.goBack());
      },
    });
  }
}
