import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthState } from '../store/auth.state';
import { AuthActions } from '../store/auth.actions';
import { AuthService } from '../services/auth.service';

// Rutas que no necesitan el token de autorización
const PUBLIC_URLS = ['/auth/admin/login', '/auth/admin/refresh'];

const isPublicUrl = (url: string): boolean =>
  PUBLIC_URLS.some((publicUrl) => url.includes(publicUrl));

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const store = inject(Store);
  const authService = inject(AuthService);

  if (isPublicUrl(req.url)) {
    return next(req);
  }

  const accessToken = store.selectSnapshot(AuthState.accessToken);

  const authReq = accessToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 → intenta renovar el token con el refresh token (httpOnly cookie)
      if (error.status === 401 && !isPublicUrl(req.url)) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            store.dispatch(
              new AuthActions.RefreshTokenSuccess(response.data.accessToken),
            );

            // Reintenta la petición original con el nuevo token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.data.accessToken}`,
              },
            });

            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Refresh también falló → cierra sesión
            store.dispatch(new AuthActions.Logout());
            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
