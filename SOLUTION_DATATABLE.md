# Solución: DataTable Parpadeo + Optimización BaseStore

## 📋 Resumen Ejecutivo

Se ha implementado una solución integral que **elimina el parpadeo** del p-table al paginar/buscar/filtrar, se han optimizado los componentes según best practices de Angular 19, y se ha estandarizado el manejo de pageSize.

### Resultados

✅ **Skeleton solo se muestra en la carga inicial**  
✅ **Paginación/búsqueda/filtrado es fluido sin parpadeo**  
✅ **Código más limpio y mantenible**  
✅ **Mejor separación de responsabilidades**

---

## 🔧 Cambios Técnicos

### 1. BaseStore (`src/app/core/store/base.store.ts`)

#### Antes ❌

```ts
readonly loadingState = computed(() => ({
  initial: this.resource.isLoading() && this.items().length === 0,
  updating: this.resource.isLoading() && this.items().length > 0,
}));
```

**Problema**: Cada vez que se pagina, busca o filtra, `isLoading()` vuelve a true momentáneamente.

#### Después ✅

```ts
// Nueva señal privada
private readonly hasLoadedOnce = signal(false);

// Effect para marcar la primera carga
constructor() {
  effect(() => {
    const status = this.resource.status();
    if (!this.hasLoadedOnce() && this.resource.value() !== undefined) {
      this.hasLoadedOnce.set(true);
    }
  });
}

// Nueva lógica: marca si es la PRIMERA carga
readonly loadingState = computed(() => ({
  initial: this.resource.isLoading() && !this.hasLoadedOnce(),
  updating: this.resource.isLoading() && this.hasLoadedOnce(),
}));
```

**Ventajas**:

- `initial`: true SOLO en la primera carga antes de `hasLoadedOnce`
- `updating`: true en paginaciones posteriores, pero NO dispara skeleton
- Transición suave después de la primera carga

#### Cambios Adicionales

- Removido `linkedSignal` (innecesario)
- Reemplazado por `computed()` para `data` y `selected`
- Mejor manejo de null safety

---

### 2. DataTableComponent (`src/app/shared/components/ui/data-table/`)

#### Mejoras en TypeScript

```ts
// ============================================================
// INPUTS - Claramente documentados
// ============================================================
readonly data = input.required<T[]>();
readonly totalItems = input<number>(0);
readonly config = input.required<DataTableConfig<T>>();
readonly loading = input<boolean>(false);      // Skeleton inicial
readonly isSaving = input<boolean>(false);     // Carga silenciosa
readonly rows = input<number>(10);
readonly first = input<number>(0);

// ============================================================
// TWO-WAY BINDING & OUTPUTS
// ============================================================
readonly selectedRows = model<T[]>([]);
readonly searchChange = output<string>();
readonly filterDrawer = output<void>();
readonly onPageChange = output<any>();
readonly deleteAll = output<T[]>();

// ============================================================
// MÉTODOS CON DOCUMENTACIÓN
// ============================================================
/**
 * Extrae el valor de una fila por campo con soporte para rutas (ej: 'address.city')
 */
getValue(row: T, col: TableColumn<T>): any { ... }

/**
 * Obtiene la configuración de badge para un valor
 */
getBadge(col: TableColumn<T>, value: any): BadgeConfig | undefined { ... }
```

#### Mejoras en Template

```html
<!-- Antes: Mostraba skeleton incorrectamente en cada recarga -->
<p-table [value]="loading() ? skeletonRows : data()">
  <!-- Después: Ahora con mejor control -->
  @for (_ of skeletonRows; track $index) {
  <!-- Skeleton solo cuando loading=true (primera carga) -->
  }</p-table
>
```

---

### 3. CategoryListComponent (`src/app/features/catalogs/categories/`)

#### Antes ❌

```ts
// Propiedades redundantes
readonly pageSize = computed(() => this.store.filter().limit ?? 10);

// Template pasaba datos innecesarios
[rows]="pageSize()"
[first]="firstRowIndex()"
```

#### Después ✅

```ts
// Solo necesita calcular el índice
readonly firstRowIndex = computed(() => {
  const { page = 1, limit = 10 } = this.store.filter();
  return (page - 1) * limit;
});

// Template simplificado
[first]="firstRowIndex()"
[config]="tableConfig"  <!-- El config.pageSize está en tableConfig -->
```

**Beneficio**: No hay redundancia, menos cambio detección, código más claro.

---

### 4. DataTableConfig Type (`src/app/shared/types/data-table.type.ts`)

#### Antes

```ts
export type DataTableConfig<T = any> = {
  columns: TableColumn<T>[];
  pageSize?: number; // ¿Default? ¿10, 15, 20?
  pageSizeOptions?: number[]; // ¿Qué valores?
  // ...
};
```

#### Después

```ts
export type DataTableConfig<T = any> = {
  columns: TableColumn<T>[];

  // Paginación (ESTANDARIZADO A 10 POR DEFECTO)
  /** Registros por página. Default: 10. No se recomienda cambiar. */
  pageSize?: number;
  /** Opciones disponibles al cambiar rows per page. Default: [10, 25, 50] */
  pageSizeOptions?: number[];

  // Comportamiento
  globalFilter?: boolean;
  showFilter?: boolean;
  selectable?: boolean;
  dataKey?: string;
};
```

Con ejemplos en JSDoc y valores estandarizados.

---

## 📊 Flujo de Ejecución

### Primera Carga

```
1. Component se monta → hasLoadedOnce = false
   ↓
2. httpResource dispara → isLoading = true
   ↓
3. loadingState.initial = true
   ↓
4. DataTable: [loading]="true" → Muestra skeleton
   ↓
5. Respuesta success → resource.value() ≠ undefined
   ↓
6. Effect se ejecuta → hasLoadedOnce = true
   ↓
7. Vista actualiza con datos reales
```

### Paginación / Búsqueda / Filtrado

```
1. Usuario pagina → handlePagination()
   ↓
2. store.setFilter({ page, limit })
   ↓
3. filter signal cambia → httpResource se reejecuta → isLoading = true
   ↓
4. loadingState.initial = false (ya está cargado)
   loadingState.updating = true
   ↓
5. DataTable: [loading]="false" → NO muestra skeleton
   [isSaving]="true" → (opcional, para UI)
   ↓
6. Datos anteriores persisten en UI (carga silenciosa)
   ↓
7. Respuesta llega → items() se actualiza
   ↓
8. Transición suave SIN PARPADEO ✨
```

---

## 🎯 Estandarización de pageSize

### Valores Recomendados

```ts
// BaseStore (por defecto)
filter = signal<F>({
  limit: 10,  // ← ESTÁNDAR en toda la app
  ...
});

// DataTableConfig (en cada módulo)
export const categoryTableConfig: DataTableConfig<Category> = {
  pageSize: 10,                    // ← Optional (ya está en BaseStore)
  pageSizeOptions: [10, 25, 50],  // ← Opciones estándar (NO cambiar)
  ...
};

// Template
<p-table
  [rows]="config().pageSize ?? 10"
  [rowsPerPageOptions]="config().pageSizeOptions ?? [10, 25, 50]"
/>
```

### ¿Qué Pasa si Cambio pageSize Dinámicamente?

❌ **NO HACER ESTO**:

```ts
// Esto causaría saltos de página confusos
handleChangePageSize(newSize: number) {
  this.store.setFilter({ limit: newSize });
}
```

✅ **HACER ESTO**:

```ts
// El usuario elige en el dropdown → cambio automático
// El handlePagination captura el nuevo tamaño
handlePagination(event: any): void {
  const limit = event.rows;  // ← Se obtiene del evento
  this.store.setFilter({ limit });
}
```

---

## 📝 Best Practices Aplicadas

### 1. **Separación de Concerns**

- **BaseStore**: Lógica de datos y API
- **DataTableComponent**: Presentación
- **ListComponent**: Orquestación de eventos

### 2. **Señales bien Estructuradas**

```ts
// Niveles de responsabilidad claro
readonly hasLoadedOnce = signal();      // Estado privado (primera carga)
readonly filter = signal();             // Input del usuario
readonly items = computed();            // Datos crudos
readonly data = computed();             // Datos "estables"
readonly loadingState = computed();     // Estados derivados
```

### 3. **Inputs/Outputs Modernos**

```ts
// Angular 19 way
readonly data = input.required<T[]>();
readonly loading = input<boolean>(false);
readonly searchChange = output<string>();

// Evita @Input/@Output decorators
```

### 4. **Documentación Clara**

```ts
/**
 * Extrae el valor de una fila por campo con soporte para rutas
 * @param row La fila de datos
 * @param col La configuración de la columna
 * @returns El valor formateado
 */
getValue(row: T, col: TableColumn<T>): any { ... }
```

### 5. **Estandarización Consistente**

- pageSize: 10 (estándar)
- pageSizeOptions: [10, 25, 50] (no cambiar)
- Valores por defecto centralizados

---

## 🚀 Próximas Acciones

Para aplicar consistentemente en todos los módulos:

```bash
# Archivos a actualizar (similar a category-list)
src/app/features/catalogs/brands/pages/brand-list/
src/app/features/catalogs/products/pages/product-list/
src/app/features/sales/orders/pages/order-list/
src/app/features/sales/customers/pages/customer-list/
# ... etc

# Patrón a seguir:
1. Remover computed pageSize()
2. Remover [rows]="pageSize()" del template
3. Asegurar config.pageSize esté en creadores de config
4. Validar handlePagination() captura limit desde evento
```

---

## 📚 Archivos Modificados

1. ✅ `src/app/core/store/base.store.ts` - Lógica de carga mejorada
2. ✅ `src/app/shared/components/ui/data-table/data-table.component.ts` - Documentación
3. ✅ `src/app/shared/components/ui/data-table/data-table.component.html` - Template optimizado
4. ✅ `src/app/shared/types/data-table.type.ts` - Documentación con ejemplos
5. ✅ `src/app/features/catalogs/categories/pages/category-list/category-list.component.ts` - Simplificación
6. ✅ `src/app/features/catalogs/categories/pages/category-list/category-list.component.html` - Remoción de inputs redundantes

---

## ✨ Resultado Final

**Antes**: Parpadeo de skeleton en cada interacción  
**Después**: Experiencia fluida, solo skeleton en carga inicial

**Code Quality**: Mejorado significativamente  
**Mantenibilidad**: Más fácil de entender y modificar  
**Performance**: Optimizado sin cambios detectables excesivos

---

## 🔗 Referencias

- [Angular httpResource](https://angular.io/api/common/http)
- [Angular Signals](https://angular.io/guide/signals)
- [PrimeNG DataTable](https://primeng.org/datatable)
- [Angular Effect](https://angular.io/api/core/effect)
