import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

export type ConfirmOptions = {
  title?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  onAccept: () => void;
  onReject?: () => void;
};

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly confirmation = inject(ConfirmationService);
  private readonly message = inject(MessageService);

  // ── Confirm ──────────────────────────────────────────────────

  delete(options: ConfirmOptions): void {
    this.confirmation.confirm({
      header: options.title ?? 'Confirmar eliminación',
      message: options.message,
      icon: 'pi pi-info-circle delete',
      acceptLabel: options.acceptLabel ?? 'Sí, eliminar',
      rejectLabel: options.rejectLabel ?? 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => options.onAccept(),
      reject: () => options.onReject?.(),
    });
  }

  confirm(options: ConfirmOptions): void {
    this.confirmation.confirm({
      header: options.title ?? 'Confirmar acción',
      message: options.message,
      icon: 'pi pi-info-circle',
      acceptLabel: options.acceptLabel ?? 'Confirmar',
      rejectLabel: options.rejectLabel ?? 'Cancelar',
      acceptButtonProps: { severity: 'primary' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => options.onAccept(),
      reject: () => options.onReject?.(),
    });
  }

  // ── Toast ────────────────────────────────────────────────────

  success(detail: string, summary = 'Éxito'): void {
    this.message.add({ severity: 'success', summary, detail, life: 3000 });
  }

  error(detail: string, summary = 'Error'): void {
    this.message.add({ severity: 'error', summary, detail, life: 4000 });
  }

  warn(detail: string, summary = 'Advertencia'): void {
    this.message.add({ severity: 'warn', summary, detail, life: 3000 });
  }

  info(detail: string, summary = 'Información'): void {
    this.message.add({ severity: 'info', summary, detail, life: 3000 });
  }
}
