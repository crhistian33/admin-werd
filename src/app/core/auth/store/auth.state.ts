import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError, delay } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AdminInfo } from '../models/auth-response.interface';
import { AuthService } from '../services/auth.service';
import { DialogService } from '@shared/services/ui/dialog.service';

export interface AuthStateModel {
  accessToken: string | null;
  admin: AdminInfo | null;
  isLoading: boolean;
  error: string | null;
}

@State<AuthStateModel>({
  name: 'adminAuth',
  defaults: {
    accessToken: null,
    admin: null,
    isLoading: false,
    error: null,
  },
})
@Injectable()
export class AuthState {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);

  // ── Selectores ────────────────────────────────────────────────────

  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return state.accessToken ?? null;
  }

  @Selector()
  static admin(state: AuthStateModel): AdminInfo | null {
    return state.admin ?? null;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.accessToken !== null;
  }

  @Selector()
  static isLoading(state: AuthStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error;
  }

  @Selector()
  static role(state: AuthStateModel): string | null {
    return state.admin?.role ?? null;
  }

  // ── Acciones ──────────────────────────────────────────────────────

  @Action(AuthActions.Login)
  login(ctx: StateContext<AuthStateModel>, action: AuthActions.Login) {
    ctx.patchState({ isLoading: true, error: null });

    return this.authService.login(action.payload).pipe(
      tap((response) => {
        ctx.patchState({
          accessToken: response.data.accessToken,
          admin: response.data.admin,
          isLoading: false,
          error: null,
        });

        this.router.navigate(['/dashboard']);
      }),
      catchError((err) => {
        const message =
          err?.error?.message ?? 'Error al iniciar sesión. Inténtalo de nuevo.';
        ctx.patchState({
          accessToken: null,
          admin: null,
          isLoading: false,
          error: message,
        });
        this.dialog.error(message, 'Error de autenticación');
        return EMPTY;
      }),
    );
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ isLoading: true, error: null });
    return this.authService.logout().pipe(
      tap((response) => {
        ctx.patchState({
          accessToken: null,
          admin: null,
          isLoading: false,
          error: null,
        });
        this.router.navigate(['/auth/login']);
        this.dialog.success(
          response.data.message || 'Sesión cerrada exitosamente',
          'Cerrar sesión',
        );
      }),
      catchError(() => {
        // Aunque falle el backend, limpiamos el estado local
        ctx.patchState({
          accessToken: null,
          admin: null,
          isLoading: false,
          error: null,
        });
        this.router.navigate(['/auth/login']);
        return EMPTY;
      }),
    );
  }

  @Action(AuthActions.RefreshToken)
  refreshToken(ctx: StateContext<AuthStateModel>) {
    return this.authService.refreshToken().pipe(
      tap((response) => {
        ctx.dispatch(
          new AuthActions.RefreshTokenSuccess(response.data.accessToken),
        );
      }),
      catchError(() => {
        ctx.patchState({ accessToken: null, admin: null });
        this.router.navigate(['/auth/login']);
        return EMPTY;
      }),
    );
  }

  @Action(AuthActions.RefreshTokenSuccess)
  refreshTokenSuccess(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.RefreshTokenSuccess,
  ) {
    ctx.patchState({ accessToken: action.accessToken });
  }

  @Action(AuthActions.RestoreSession)
  restoreSession(ctx: StateContext<AuthStateModel>) {
    // Si no hay accessToken en memoria pero sí hay adminInfo en sessionStorage,
    // intentamos recuperar el accessToken via refresh token (httpOnly cookie)
    const { admin, accessToken } = ctx.getState();

    if (admin && !accessToken) {
      return ctx.dispatch(new AuthActions.RefreshToken());
    }

    return EMPTY;
  }
}
