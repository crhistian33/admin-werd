import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DialogService } from '@shared/services/ui/dialog.service';

/**
 * Interceptor global para el manejo de errores HTTP.
 * Captura excepciones de red y de API estructurando un mensaje amigable.
 * Funciona tanto con respuestas del backend real como del mock interceptor.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialogService = inject(DialogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado al procesar la solicitud.';
      let errorTitle = 'Error Interno';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente o problema de red al enrutar la petición
        errorMessage = `Error de red: ${error.error.message}`;
        errorTitle = 'Error de conexión';
      } else {
        // El backend devolvió un código de error de respuesta fallida
        switch (error.status) {
          case 0:
            errorTitle = 'Sin conexión';
            errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
            break;
          case 400:
            errorTitle = 'Petición incorrecta';
            errorMessage = error.error?.message || 'Los datos enviados no son válidos.';
            break;
          case 401:
            errorTitle = 'No autorizado';
            errorMessage = 'Tu sesión ha expirado o necesitas iniciar sesión.';
            // Aquí puedes lanzar un dispatch a la store de Auth o invocar AuthAPI.logout()
            break;
          case 403:
            errorTitle = 'Acceso denegado';
            errorMessage = 'No tienes los permisos suficientes para realizar esta acción.';
            break;
          case 404:
            errorTitle = 'Recurso no encontrado';
            errorMessage = error.error?.message || 'El elemento que buscas ya no existe o cambió de ubicación.';
            break;
          case 422:
             errorTitle = 'Error de validación';
             errorMessage = error.error?.message || 'Hay errores en los campos del formulario.';
             break;
          case 500:
            errorTitle = 'Error del servidor';
            errorMessage = 'Nuestros servidores experimentaron un problema. Por favor intenta más tarde.';
            break;
          default:
            errorTitle = `Error ${error.status}`;
            errorMessage = error.error?.message || error.statusText || 'Error inesperado del servidor.';
            break;
        }
      }

      // Propagar notificacion visual al usuario
      dialogService.error(errorMessage, errorTitle);
      
      // Relanzar el error para que los Stores o Componentes que hagan subscribe 
      // puedan manejar su propio estado de isSaving=false o su lógica finally
      return throwError(() => error);
    })
  );
};
