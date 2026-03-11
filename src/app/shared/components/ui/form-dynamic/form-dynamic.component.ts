import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { SkeletonModule } from 'primeng/skeleton';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-form-dynamic',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    FileUploadModule,
    SkeletonModule,
    LucideAngularModule,
  ],
  templateUrl: './form-dynamic.component.html',
  styleUrl: './form-dynamic.component.scss',
})
export class FormDynamicComponent {
  private fb = inject(FormBuilder);

  fields = input.required<FormFieldConfig[]>();
  initialData = input<Record<string, any> | null>(null);
  loading = input<boolean>(false); // Used for submit button
  fetching = input<boolean>(false); // Used for skeleton loading
  submitLabel = input<string>('Guardar');
  title = input<string>('');
  size = input<'compact' | 'full'>('full');

  submitted = output<Record<string, any>>();
  cancelled = output<void>();

  private previews: Record<string, string> = {};
  isDragging = false;

  readonly layoutClass = computed(
    () =>
      ({
        compact: { container: 'max-w-2xl', grid: 'grid grid-cols-1 gap-4' },
        full: {
          container: 'w-full',
          grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        },
      })[this.size()],
  );

  readonly form = linkedSignal(() => {
    const controls: Record<string, any> = {};
    this.fields().forEach(
      (f) => (controls[f.key] = [null, f.validators ?? []]),
    );

    const group = this.fb.group(controls);
    const data = this.initialData();

    if (data) {
      group.patchValue(data);
      this.fields()
        .filter((f) => f.type === 'file-image' && data[f.key])
        .forEach((f) => (this.previews[f.key] = data[f.key]));
    }

    return group;
  });

  onFileSelect(event: any, key: string): void {
    const file: File = event.files?.[0] ?? event.currentFiles?.[0];
    if (!file) return;

    this.form().get(key)?.setValue(file);
    this.form().get(key)?.markAsTouched();

    const field = this.fields().find((f) => f.key === key);
    if (field?.type === 'file-image') {
      const reader = new FileReader();
      reader.onload = (e) => (this.previews[key] = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  clearFile(key: string): void {
    this.form().get(key)?.setValue(null);
    delete this.previews[key];
  }

  getPreview(key: string): string | null {
    return this.previews[key] ?? null;
  }

  getFileName(key: string): string | null {
    const value = this.form().get(key)?.value;
    if (value instanceof File) return value.name;
    if (typeof value === 'string' && value)
      return value.split('/').pop() ?? value;
    return null;
  }

  getDocumentIcon(key: string): string {
    const name = this.getFileName(key) ?? '';
    if (name.endsWith('.pdf')) return 'pi pi-file-pdf';
    if (name.match(/\.(doc|docx)$/)) return 'pi pi-file-word';
    if (name.match(/\.(xls|xlsx)$/)) return 'pi pi-file-excel';
    return 'pi pi-file';
  }

  onSubmit(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form().getRawValue());
  }

  isRequired(field: FormFieldConfig): boolean {
    return field.validators?.includes(Validators.required) ?? false;
  }

  showError(key: string): boolean {
    const ctrl = this.form().get(key);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  getError(key: string): string {
    const ctrl = this.form().get(key);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required']) return 'Este campo es obligatorio';
    if (ctrl.errors['minlength'])
      return `Mínimo ${ctrl.errors['minlength'].requiredLength} caracteres`;
    if (ctrl.errors['email']) return 'Email inválido';
    if (ctrl.errors['pattern']) return 'Formato inválido';
    return 'Campo inválido';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent, fieldKey: string, fileUpload: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];

      // 1. Limpiamos el componente PrimeNG por completo
      fileUpload.clear();

      // 2. Creamos el objeto que PrimeNG espera recibir
      const eventSimulated = {
        originalEvent: event,
        files: [file],
        currentFiles: [file],
      };

      // 3. Forzamos la ejecución de tu lógica de selección
      this.onFileSelect(eventSimulated, fieldKey);

      // 4. (Opcional) Sincronizamos la lista interna de PrimeNG
      fileUpload.files = [file];
    }
  }
}
