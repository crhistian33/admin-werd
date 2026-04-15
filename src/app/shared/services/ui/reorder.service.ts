import { Injectable, signal } from '@angular/core';

export interface ReorderConfig {
  title: string;
  items: any[];
  labelField: string | ((item: any) => string);
  imageField?: string | ((item: any) => string | undefined);
  onSave: (ids: string[]) => void;
  width?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReorderService {
  readonly isVisible = signal(false);
  readonly config = signal<ReorderConfig | null>(null);
  readonly isSaving = signal(false);

  open(config: ReorderConfig): void {
    this.config.set(config);
    this.isVisible.set(true);
  }

  close(): void {
    this.isVisible.set(false);
    this.config.set(null);
    this.isSaving.set(false);
  }

  setLoading(value: boolean): void {
    this.isSaving.set(value);
  }
}
