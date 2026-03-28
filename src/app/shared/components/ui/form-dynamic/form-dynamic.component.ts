import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { SkeletonModule } from 'primeng/skeleton';
import { CheckboxModule } from 'primeng/checkbox';
import { FormFieldConfig } from '@shared/types/form-dynamic.type';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '@env/environment';

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
    CheckboxModule,
    LucideAngularModule,
  ],
  templateUrl: './form-dynamic.component.html',
  styleUrl: './form-dynamic.component.scss',
})
export class FormDynamicComponent {
  private readonly fb = inject(FormBuilder);

  // ── Inputs ────────────────────────────────────────────────────────
  fields = input.required<FormFieldConfig[]>();
  initialData = input<Record<string, any> | null>(null);
  loading = input<boolean>(false);
  fetching = input<boolean>(false);
  submitLabel = input<string>('Guardar');
  title = input<string>('');
  size = input<'compact' | 'full'>('full');

  // ── Outputs ───────────────────────────────────────────────────────
  submitted = output<Record<string, any>>();
  cancelled = output<void>();

  // ── Disparador por ID ─────────────────────────────────────────────
  // linkedSignal solo se recalcula cuando cambia el ID, no en cada
  // cambio de referencia del objeto initialData completo
  private readonly dataId = computed(() => {
    const data = this.initialData();
    return data ? data['id'] : undefined;
  });

  // ── Previews ──────────────────────────────────────────────────────
  // linkedSignal con source=dataId: se inicializa cuando llegan los datos
  // del servidor pero NO se recalcula cuando el usuario limpia o cambia el preview
  readonly previews = linkedSignal<
    string | number | undefined,
    Record<string, string>
  >({
    source: () => this.dataId(),
    computation: (id) => {
      const data = this.initialData();
      const currentFields = untracked(() => this.fields());

      return untracked(() => {
        if (!data) return {};

        const newPreviews: Record<string, string> = {};
        currentFields
          .filter((f) => f.type === 'file-image')
          .forEach((f) => {
            const remotePath = data['_currentImageUrl'];
            if (remotePath) {
              newPreviews[f.key] = remotePath.startsWith('http')
                ? remotePath
                : `${environment.apiImagesUrl}${remotePath}`;
            }
          });

        return newPreviews;
      });
    },
  });

  // ── IDs de imágenes eliminadas ────────────────────────────────────
  // key = nombre del campo (ej: 'tempImageId')
  // value = ID del registro Image que tenía antes de ser borrado
  // Se resetea cuando cambia el dataId (nueva entidad cargada)
  readonly removedImageIds = linkedSignal<
    string | number | undefined,
    Record<string, string>
  >({
    source: () => this.dataId(),
    // Al cargar una entidad nueva, resetea los IDs eliminados
    computation: () => ({}),
  });

  // ── Subidas en progreso ───────────────────────────────────────────
  readonly uploadingFields = signal<Record<string, boolean>>({});

  isDragging = false;

  // ── Formulario ────────────────────────────────────────────────────
  readonly form = linkedSignal<string | number | undefined, FormGroup>({
    source: () => this.dataId(),
    computation: () => {
      const data = this.initialData();
      const currentFields = untracked(() => this.fields());

      return untracked(() => {
        const controls: Record<string, any> = {};

        currentFields.forEach((f) => {
          const initialValue =
            f.type === 'file-image'
              ? null
              : data
                ? (data[f.key] ?? null)
                : null;
          controls[f.key] = [initialValue, f.validators ?? []];
        });

        const group = this.fb.group(controls);

        if (data) {
          const safeData = { ...data };
          currentFields
            .filter((f) => f.type === 'file-image')
            .forEach((f) => delete safeData[f.key]);
          group.patchValue(safeData);
        }

        return group;
      });
    },
  });

  // ── Layout ────────────────────────────────────────────────────────
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

  // ── Helpers ───────────────────────────────────────────────────────

  isUploadingField(key: string): boolean {
    return this.uploadingFields()[key] ?? false;
  }

  isUploading(): boolean {
    return Object.values(this.uploadingFields()).some(Boolean);
  }

  // ── Manejo de archivos ────────────────────────────────────────────

  async onFileSelect(event: any, key: string): Promise<void> {
    const file: File = event.files?.[0] ?? event.currentFiles?.[0];
    if (!file) return;

    const field = this.fields().find((f) => f.key === key);
    if (!field || field.type !== 'file-image') return;

    // Preview local inmediato
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previews.update((prev) => ({
        ...prev,
        [key]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    if (field.uploadHandler) {
      this.uploadingFields.update((prev) => ({ ...prev, [key]: true }));
      this.form().get(key)?.setValue(null);

      try {
        const tempImageId = await field.uploadHandler(file);
        this.form().get(key)?.setValue(tempImageId);
        this.form().get(key)?.markAsTouched();
      } catch {
        this.previews.update((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        this.form().get(key)?.setValue(null);
      } finally {
        this.uploadingFields.update((prev) => ({ ...prev, [key]: false }));
      }
    } else {
      this.form().get(key)?.setValue(file);
      this.form().get(key)?.markAsTouched();
    }
  }

  clearFile(key: string): void {
    // Guarda el ID de la imagen que se elimina para enviarlo al backend
    // El ID viene en initialData como '_currentImageId_<key>'
    // Ejemplo: '_currentImageId_tempImageId' para categorías
    const data = this.initialData();
    const imageId = data?.[`_currentImageId_${key}`] as string | undefined;

    if (imageId) {
      this.removedImageIds.update((prev) => ({ ...prev, [key]: imageId }));
    }

    // Limpia el control y el preview
    this.form().get(key)?.setValue(null);
    this.form().get(key)?.markAsDirty();
    this.previews.update((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  // ── Drag & Drop ───────────────────────────────────────────────────

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent, fieldKey: string, fileUpload: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    fileUpload.clear();
    void this.onFileSelect(
      { files: [files[0]], currentFiles: [files[0]] },
      fieldKey,
    );
    fileUpload.files = [files[0]];
  }

  // ── Submit ────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.form().invalid || this.isUploading()) {
      this.form().markAllAsTouched();
      return;
    }

    console.log('Data ID', this.dataId());
    console.log('Form data to submit:', this.form().getRawValue());

    // Incluye los IDs de imágenes eliminadas para que el componente padre
    // los use al construir el payload del backend
    this.submitted.emit({
      ...this.form().getRawValue(),
      _removedImageIds: this.removedImageIds(),
    });
  }

  // ── Validaciones ──────────────────────────────────────────────────

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

  // ── Helpers de documentos ─────────────────────────────────────────

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
}
