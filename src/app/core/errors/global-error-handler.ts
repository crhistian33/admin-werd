import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { DialogService } from '@shared/services/ui/dialog.service';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Manejador global de errores en la aplicación Angular.
 * Atrapa errores Javascript síncronos y asíncronos no controlados y muestra
 * una notificación global, evitando que la aplicación muera silenciosamente.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private zone: NgZone) {}

  handleError(error: any): void {
    // Si el error es una respuesta HTTP, `errorInterceptor` ya lo procesó y
    // notificó al usuario. No queremos mostrar toasts duplicados.
    const isHttpError = error instanceof HttpErrorResponse || 
                       (error.rejection instanceof HttpErrorResponse) || 
                       (error.name === 'HttpErrorResponse') ||
                       (error?.cause instanceof HttpErrorResponse);

    if (!isHttpError) {
      // Obtenemos el servicio manualmente mediante injector para evitar referencias circulares
      // porque ErrorHandler es inyectado a muy bajo nivel en Angular.
      const dialogService = this.injector.get(DialogService);
      
      const errorMessage = error.message ? error.message : error.toString();
      
      // zone.run asegura que el ciclo de detección de cambios de Angular notará este toast.
      // A veces los errores JS provienen de callbacks fuera de la zona de Angular.
      this.zone.run(() => {
        dialogService.error(
          'Ha surgido un problema imprevisto. Si este error persiste, por favor contacta a soporte técnico.',
          'Error Inesperado de Sistema'
        );
      });
    }

    // Siempre registramos el error crudo en consola para que los devs puedan depurarlo.
    console.error('[GlobalErrorHandler]', error);
  }
}
