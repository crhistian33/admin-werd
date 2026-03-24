import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthActions } from '@core/auth/store/auth.actions';
import { AuthState } from '@core/auth/store/auth.state';
import { Store } from '@ngxs/store';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    LucideAngularModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  // 1. Estado del Store
  readonly isLoading = this.store.selectSignal(AuthState.isLoading);

  // 2. Formulario Reactivo
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // 3. Signals vinculados al valor de los inputs (disparan el re-cálculo de los errores)
  private readonly emailValue = toSignal(
    this.loginForm.controls.email.valueChanges,
  );
  private readonly passwordValue = toSignal(
    this.loginForm.controls.password.valueChanges,
  );

  // Signal para controlar si ya se intentó enviar el formulario
  private readonly formTouched = signal(false);

  // 4. Computed que reaccionan al escribir
  readonly emailError = computed(() => {
    this.emailValue(); // "Escuchamos" el cambio de valor aquí
    const ctrl = this.loginForm.controls.email;

    if (!this.formTouched() || ctrl.valid) return null;

    if (ctrl.hasError('required')) return 'El correo es requerido';
    if (ctrl.hasError('email')) return 'Ingresa un correo válido';
    return null;
  });

  readonly passwordError = computed(() => {
    this.passwordValue(); // "Escuchamos" el cambio de valor aquí
    const ctrl = this.loginForm.controls.password;

    if (!this.formTouched() || ctrl.valid) return null;

    if (ctrl.hasError('required')) return 'La contraseña es requerida';
    if (ctrl.hasError('minlength')) return 'Mínimo 6 caracteres';
    return null;
  });

  onSubmit(): void {
    this.formTouched.set(true);

    if (this.loginForm.invalid) return;

    this.store.dispatch(new AuthActions.Login(this.loginForm.getRawValue()));
  }
}
