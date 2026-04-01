import {
  Component,
  effect,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FilterFieldConfig } from '@shared/types/filter-config.type';
import { FilterDrawerComponent } from '../filter-drawer/filter-drawer.component';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dynamic',
  imports: [
    FilterDrawerComponent,
    FloatLabel,
    SelectModule,
    DatePickerModule,
    FormsModule,
  ],
  templateUrl: './filter-dynamic.component.html',
  styleUrl: './filter-dynamic.component.scss',
})
export class FilterDynamicComponent implements OnInit {
  config = input.required<FilterFieldConfig[]>();
  visible = model(false);

  initialValues = input<Record<string, any>>({});

  filterChange = output<Record<string, any>>();
  filterClear = output<void>();

  // Objeto plano para binding estable
  formValues: Record<string, any> = {};

  constructor() {
    effect(
      () => {
        const storeFilters = this.initialValues();
        this.syncFormWithStore(storeFilters);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    // Inicialización síncrona al crear el componente
    // Garantiza que los valores del store se cargan aunque el effect tarde
    this.syncFormWithStore(this.initialValues());
  }

  // Extraemos la lógica a un método para mayor claridad
  private syncFormWithStore(filters: Record<string, any>) {
    this.config().forEach((field) => {
      const value = filters[field.key];
      // Importante: PrimeNG necesita null para limpiar, undefined a veces no lo resetea
      this.formValues[field.key] = value !== undefined ? value : null;
    });
  }

  onChange(key: string, value: any) {
    this.filterChange.emit({ [key]: value });
  }

  onDateChange(key: string, range: Date[] | null) {
    const val = !range || !range[0] ? null : [range[0], range[1] ?? null];
    this.filterChange.emit({ [key]: val });
  }

  handleClear = () => {
    this.formValues = {};
    this.filterClear.emit();
  };
}
