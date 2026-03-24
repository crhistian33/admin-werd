// src/app/core/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';
import { AuthActions } from '../store/auth.actions';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const store = inject(Store);
  const router = inject(Router);
  // const authService = inject(AuthService);

  // const accessToken = store.selectSnapshot(AuthState.accessToken);

  // // Si hay token en memoria, acceso permitido
  // if (accessToken) return true;

  // // Sin token en memoria → intenta recuperar con refresh token (httpOnly cookie)
  // try {
  //   const response = await firstValueFrom(authService.refreshToken());
  //   store.dispatch(
  //     new AuthActions.RefreshTokenSuccess(response.data.accessToken),
  //   );
  //   return true;
  // } catch {
  //   // Refresh falló → redirige al login
  //   router.navigate(['/auth/login']);
  //   return false;

  //}

  // Usamos selectSnapshot para rapidez atómica
  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

  if (isAuthenticated) return true;

  // Si no está autenticado, al login sin preguntar más
  return router.createUrlTree(['/auth/login']);
};

// Guard inverso — redirige al dashboard si ya está autenticado
// Usado en la ruta del login para evitar volver a la pantalla de login
export const guestGuard: CanActivateFn = async () => {
  const store = inject(Store);
  const router = inject(Router);
  // const authService = inject(AuthService);

  // const accessToken = store.selectSnapshot(AuthState.accessToken);

  // if (accessToken) {
  //   router.navigate(['/dashboard']);
  //   return false;
  // }

  // // Intenta recuperar sesión via refresh token
  // try {
  //   const response = await firstValueFrom(authService.refreshToken());
  //   store.dispatch(
  //     new AuthActions.RefreshTokenSuccess(response.data.accessToken),
  //   );
  //   router.navigate(['/dashboard']);
  //   return false;
  // } catch {
  //   // No hay sesión activa — puede acceder al login
  //   return true;
  // }

  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

  // Si ya está dentro, lo mandamos al dashboard
  if (isAuthenticated) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
