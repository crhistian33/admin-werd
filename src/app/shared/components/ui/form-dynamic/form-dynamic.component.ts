import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  untracked,
  effect,
  DestroyRef,
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
import { EditorModule } from 'primeng/editor';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { OrderListModule } from 'primeng/orderlist';
import { StepperModule } from 'primeng/stepper';
import {
  FormFieldConfig,
  FormStepConfig,
} from '@shared/types/form-dynamic.type';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '@env/environment';
import { ImageUploadService } from '@shared/images/services/image-upload.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePickerModule } from 'primeng/datepicker';

type RemovedImageMap = { [key: string]: string | string[] };

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
    EditorModule,
    ToggleSwitchModule,
    OrderListModule,
    StepperModule,
    LucideAngularModule,
    DatePickerModule,
  ],
  templateUrl: './form-dynamic.component.html',
  styleUrl: './form-dynamic.component.scss',
})
export class FormDynamicComponent {
  private readonly fb = inject(FormBuilder);
  private readonly imageUpload = inject(ImageUploadService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Reset activeAction when global loading turns off
    effect(() => {
      if (!this.loading()) {
        untracked(() => this.activeAction.set(null));
      }
    });
  }

  // ── Inputs ────────────────────────────────────────────────────────
  steps = input.required<FormStepConfig[]>();
  readonly flatFields = computed(() => this.steps().flatMap((s) => s.fields));
  initialData = input<Record<string, any> | null>(null);
  loading = input<boolean>(false);
  fetching = input<boolean>(false);
  submitLabel = input<string>('Guardar');
  title = input<string>('');
  size = input<'compact' | 'full'>('full');
  customActions = input<
    { label: string; action: string; icon?: string; severity?: string }[]
  >([]);

  // ── Outputs ───────────────────────────────────────────────────────
  submitted = output<Record<string, any>>();
  customActionSubmit = output<{ action: string; data: Record<string, any> }>();
  cancelled = output<void>();

  // ── Disparador por ID ─────────────────────────────────────────────
  // linkedSignal solo se recalcula cuando cambia el ID, no en cada
  // cambio de referencia del objeto initialData completo
  readonly dataId = computed(() => {
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
      const currentFields = untracked(() => this.flatFields());

      return untracked(() => {
        if (!data) return {};

        const newPreviews: Record<string, string> = {};
        currentFields
          .filter((f) => f.type === 'file-image')
          .forEach((f) => {
            const remotePath =
              data[`_currentImageUrl_${f.key}`] || data['_currentImageUrl'];
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
    RemovedImageMap
  >({
    source: () => this.dataId(),
    // Al cargar una entidad nueva, resetea los IDs eliminados
    computation: (): RemovedImageMap => ({}),
  });

  // ── Subidas en progreso ───────────────────────────────────────────
  readonly uploadingFields = signal<Record<string, boolean>>({});

  /**
   * Rastrea qué acción de guardado se está ejecutando para mostrar
   * el spinner solo en ese botón y deshabilitar los otros.
   */
  readonly activeAction = signal<string | null>(null);

  // ── Galería de imágenes (file-gallery) ───────────────────────────
  // key = field.key, value = array de { tempId, previewUrl }
  readonly galleryItems = linkedSignal<
    string | number | undefined,
    Record<
      string,
      { tempId: string; previewUrl: string; isExisting: boolean }[]
    >
  >({
    source: () => this.dataId(),
    computation: () => {
      const data = this.initialData();
      const currentFields = untracked(() => this.flatFields());

      return untracked(() => {
        if (!data) return {};
        const items: Record<
          string,
          { tempId: string; previewUrl: string; isExisting: boolean }[]
        > = {};

        currentFields
          .filter((f) => f.type === 'file-gallery')
          .forEach((f) => {
            const remoteItems = data[`_galleryItems_${f.key}`];
            if (Array.isArray(remoteItems)) {
              items[f.key] = remoteItems.map((item: any) => ({
                tempId: item.tempId || item.id,
                previewUrl: item.url?.startsWith('http')
                  ? item.url
                  : `${environment.apiImagesUrl}${item.url}`,
                isExisting: true, // ← marca como existente
              }));
            }
          });

        return items;
      });
    },
  });

  isDragging = false;

  // ── Formulario ────────────────────────────────────────────────────
  readonly form = linkedSignal<string | number | undefined, FormGroup>({
    source: () => this.dataId(),
    computation: () => {
      const data = this.initialData();
      const currentFields = untracked(() => this.flatFields());

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
            .filter((f) => f.type === 'file-image' || f.type === 'file-gallery')
            .forEach((f) => delete safeData[f.key]);

          Object.keys(safeData).forEach((k) => {
            if (k.startsWith('_')) delete safeData[k];
          });
          group.patchValue(safeData);
        }

        return group;
      });
    },
  });

  readonly layoutClass = computed(
    () =>
      ({
        compact: { container: 'max-w-4xl', grid: 'grid grid-cols-1 gap-4' },
        full: {
          container: 'w-full',
          grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4',
        },
      })[this.size()],
  );

  getFieldColClass(cols?: number): string {
    if (this.size() !== 'full') return 'col-span-1';
    switch (cols) {
      case 4:
        return 'col-span-1 md:col-span-2 lg:col-span-4';
      case 3:
        return 'col-span-1 md:col-span-2 lg:col-span-3';
      case 2:
        return 'col-span-1 md:col-span-2 lg:col-span-2';
      case 1:
      default:
        return 'col-span-1';
    }
  }

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

    const field = this.flatFields().find((f) => f.key === key);
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
    const data = this.initialData();
    const existingImageId = data?.[`_currentImageId_${key}`] as
      | string
      | undefined;

    if (existingImageId) {
      this.removedImageIds.update((prev: RemovedImageMap) => ({
        ...prev,
        [key]: existingImageId, // string simple para imagen principal
      }));
    } else {
      const currentTempId = this.form().get(key)?.value as string | null;
      if (currentTempId) {
        this.imageUpload
          .deleteTempById(currentTempId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({ error: () => null });
      }
    }

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

  // ── Galería (file-gallery) ────────────────────────────────────────

  async onGalleryFileSelect(
    event: any,
    key: string,
    fileUpload: any,
  ): Promise<void> {
    const files: File[] = Array.from(event.files ?? event.currentFiles ?? []);
    if (!files.length) return;

    fileUpload.clear();

    const field = this.flatFields().find((f) => f.key === key);
    if (!field || field.type !== 'file-gallery') return;

    const currentCount = this.galleryItems()[key]?.length ?? 0;
    const remainingSlots = 3 - currentCount;
    if (remainingSlots <= 0) return;

    const filesToProcess = files.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      this.uploadingFields.update((prev) => ({ ...prev, [key]: true }));

      // Preview local inmediato
      const previewUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      try {
        let tempId: string;
        if (field.uploadHandler) {
          tempId = await field.uploadHandler(file);
        } else {
          // Fallback: usar URL local (sin subida real)
          tempId = previewUrl;
        }

        this.galleryItems.update((prev) => ({
          ...prev,
          [key]: [
            ...(prev[key] ?? []),
            { tempId, previewUrl, isExisting: false },
          ],
        }));

        // Sincroniza el control reactivo con el array de tempIds
        this._syncGalleryControl(key);
      } catch {
        // el uploadHandler falló – no agregamos el item
      } finally {
        this.uploadingFields.update((prev) => ({ ...prev, [key]: false }));
      }
    }
  }

  removeGalleryItem(key: string, index: number): void {
    const itemToRemove = (this.galleryItems()[key] ?? [])[index];

    if (itemToRemove) {
      if (itemToRemove.isExisting) {
        this.removedImageIds.update((rm: RemovedImageMap) => {
          const existing = rm[key];
          const updated: string[] = Array.isArray(existing)
            ? [...existing, itemToRemove.tempId]
            : existing
              ? [existing, itemToRemove.tempId]
              : [itemToRemove.tempId];
          return { ...rm, [key]: updated };
        });
      } else {
        this.imageUpload
          .deleteTempById(itemToRemove.tempId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({ error: () => null });
      }
    }

    this.galleryItems.update((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((_, i) => i !== index),
    }));
    this._syncGalleryControl(key);
  }

  private _syncGalleryControl(key: string): void {
    const newIds = (this.galleryItems()[key] ?? [])
      .filter((i) => !i.isExisting)
      .map((i) => i.tempId);

    this.form().get(key)?.setValue(newIds);
    this.form().get(key)?.markAsDirty();
  }

  // ── Specs ─────────────────────────────────────────────────────────

  getSpecsValue(
    key: string,
  ): { specKey: string; specValue: string; sortOrder: number }[] {
    return this.form().get(key)?.value ?? [];
  }

  addSpec(key: string): void {
    const current = this.getSpecsValue(key);
    const updated = [
      ...current,
      { specKey: '', specValue: '', sortOrder: current.length },
    ];
    this.form().get(key)?.setValue(updated);
    this.form().get(key)?.markAsDirty();
  }

  updateSpec(
    key: string,
    index: number,
    field: 'specKey' | 'specValue',
    value: string,
  ): void {
    const current = [...this.getSpecsValue(key)];
    current[index] = { ...current[index], [field]: value };
    this.form().get(key)?.setValue(current);
  }

  removeSpec(key: string, index: number): void {
    const updated = this.getSpecsValue(key)
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, sortOrder: i }));
    this.form().get(key)?.setValue(updated);
    this.form().get(key)?.markAsDirty();
  }

  onSpecsReorder(key: string, items: any[]): void {
    const reordered = items.map((s, i) => ({ ...s, sortOrder: i }));
    this.form().get(key)?.setValue(reordered);
    this.form().get(key)?.markAsDirty();
  }

  // ── Features ──────────────────────────────────────────────────────

  getFeaturesValue(key: string): { feature: string; sortOrder: number }[] {
    return this.form().get(key)?.value ?? [];
  }

  addFeature(key: string): void {
    const current = this.getFeaturesValue(key);
    const updated = [...current, { feature: '', sortOrder: current.length }];
    this.form().get(key)?.setValue(updated);
    this.form().get(key)?.markAsDirty();
  }

  updateFeature(key: string, index: number, value: string): void {
    const current = [...this.getFeaturesValue(key)];
    current[index] = { ...current[index], feature: value };
    this.form().get(key)?.setValue(current);
  }

  removeFeature(key: string, index: number): void {
    const updated = this.getFeaturesValue(key)
      .filter((_, i) => i !== index)
      .map((f, i) => ({ ...f, sortOrder: i }));
    this.form().get(key)?.setValue(updated);
    this.form().get(key)?.markAsDirty();
  }

  onFeaturesReorder(key: string, items: any[]): void {
    const reordered = items.map((f, i) => ({ ...f, sortOrder: i }));
    this.form().get(key)?.setValue(reordered);
    this.form().get(key)?.markAsDirty();
  }

  // ── Submit ────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.form().invalid || this.isUploading()) {
      this.form().markAllAsTouched();
      return;
    }

    this.activeAction.set('submit');

    const { ...formValue } = this.form().getRawValue();

    // Solo incluir _removedImageIds si hay campos de imagen en el form
    const hasImageFields = this.flatFields().some(
      (f) => f.type === 'file-image' || f.type === 'file-gallery',
    );

    this.submitted.emit({
      ...formValue,
      ...(hasImageFields ? { _removedImageIds: this.removedImageIds() } : {}),
    });
  }

  onCustomActionSubmit(action: string): void {
    if (this.form().invalid || this.isUploading()) {
      this.form().markAllAsTouched();
      return;
    }

    this.activeAction.set(action);

    this.customActionSubmit.emit({
      action,
      data: {
        ...this.form().getRawValue(),
        _removedImageIds: this.removedImageIds(),
      },
    });
  }

  nextStep(stepIndex: number, activateCallback: (val: number) => void): void {
    const currentStep = this.steps()[stepIndex];
    let isValid = true;

    currentStep.fields.forEach((field) => {
      const control = this.form().get(field.key);
      if (control?.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    if (isValid) {
      activateCallback(stepIndex + 2); // activateCallback es 1-based (Paso 1 = valor 1), por lo tanto next step = i + 2
    }
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
