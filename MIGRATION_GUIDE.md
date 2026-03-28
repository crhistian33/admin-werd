# 🔄 Guía de Migración - Aplicar Solución en Otros Módulos

## 📋 Módulos Afectados

Basado en el workspace, estos módulos usan DataTableComponent y necesitan actualización:

```
✅ categories      (COMPLETADO)
⏳ brands
⏳ products
⏳ reviews
⏳ orders
⏳ customers
⏳ movements
⏳ stocks
⏳ offers
⏳ vouchers
⏳ faqs
⏳ sliders
⏳ staticpages
⏳ roles
⏳ accounts
```

---

## 🔧 Pasos para Migrar Cada Módulo

### 1️⃣ Editar el List Component (`*-list.component.ts`)

**BUSCAR** el computed que no necesitas:

```ts
readonly pageSize = computed(() => this.store.filter().limit ?? 10); // ❌ REMOVER
```

**MANTENER**:

```ts
readonly firstRowIndex = computed(() => {
  const { page = 1, limit = 10 } = this.store.filter();
  return (page - 1) * limit;
});
```

**ACTUALIZAR** los handlers si existen:

```ts
handlePagination(event: any): void {
  const page = Math.floor(event.first / event.rows) + 1;
  const limit = event.rows;
  this.store.setFilter({ page, limit } as any);
}

handleSearch(query: string): void {
  this.store.setFilter({ search: query, page: 1 } as any);
}
```

### 2️⃣ Editar Template (`*-list.component.html`)

**BUSCAR**:

```html
<app-data-table
  [rows]="pageSize()"           <!-- ❌ REMOVER ESTA LÍNEA -->
  [first]="firstRowIndex()"
  ...
/>
```

**CAMBIAR A**:

```html
<app-data-table [first]="firstRowIndex()" [config]="tableConfig" [data]="store.items()" [totalItems]="store.totalItems()" [loading]="store.loadingState().initial" [isSaving]="store.loadingState().updating" (onPageChange)="handlePagination($event)" (searchChange)="handleSearch($event)" (deleteAll)="onDeleteAll($event)"> </app-data-table>
```

### 3️⃣ Editar Config (`*-table.config.ts`)

**VERIFICAR** que existe `pageSize`:

```ts
export const productTableConfig = (
  router: Router,
  callback: ProductTableCallbacks,
): DataTableConfig<Product> => ({
  pageSize: 10,                    // ✅ Asegurar está aquí
  pageSizeOptions: [10, 25, 50],  // ✅ Nunca cambiar estos
  columns: [...],
  actions: [...],
  // ...
});
```

Si no existe `pageSize`, AÑADIR:

```ts
{
  pageSize: 10,
  pageSizeOptions: [10, 25, 50],
  // ... resto de config
}
```

---

## ✅ Checklist por Módulo

### Brands (`src/app/features/catalogs/brands/`)

- [ ] Editar `brand-list.component.ts`
- [ ] Remover `pageSize` computed
- [ ] Editar template
- [ ] Verificar `brand-table.config.ts`
- [ ] Mantener `firstRowIndex()` computed
- [ ] Validar `handlePagination()` y `handleSearch()`

### Products (`src/app/features/catalogs/products/`)

- [ ] Editar `product-list.component.ts`
- [ ] Remover `pageSize` computed
- [ ] Editar template
- [ ] Verificar `product-table.config.ts`
- [ ] Mantener `firstRowIndex()` computed
- [ ] Validar handlers

### Orders (`src/app/features/sales/orders/`)

- [ ] Editar `order-list.component.ts`
- [ ] Remover `pageSize` computed
- [ ] Editar template
- [ ] Verificar `order-table.config.ts`
- [ ] Mantener `firstRowIndex()` computed
- [ ] Validar handlers

### Customers (`src/app/features/sales/customers/`)

- [ ] TBD...

---

## 🔍 Verificación Rápida

Para **CADA módulo**, verificar:

```bash
# 1. ¿Existe el computed pageSize?
grep -n "readonly pageSize = computed" */pages/*list/*.component.ts

# 2. ¿Se está usando en template?
grep -n "\[rows\]=" */pages/*list/*.component.html

# 3. ¿Config tiene pageSize?
grep -n "pageSize:" */config/*table.config.ts

# 4. ¿Compile sin errores?
ng build  # o verificar en VSCode
```

---

## 🎯 Orden Recomendado

**Fase 1 (Catalogs)**

1. ✅ categories
2. ⏳ brands
3. ⏳ products
4. ⏳ reviews

**Fase 2 (Sales)** 5. ⏳ orders 6. ⏳ customers

**Fase 3 (Otros)** 7. ⏳ inventary (movements, stocks) 8. ⏳ marketing (offers, vouchers) 9. ⏳ contents (faqs, sliders, staticpages) 10. ⏳ users (roles, accounts)

---

## 🧪 Testing Manual

**Por cada módulo migrado**, verificar:

```ts
✅ Primera carga:
   - Muestra skeleton 2-3 segundos
   - Después muestra datos reales

✅ Paginación:
   - SIN parpadeo
   - Datos anteriores se mantienen mientras carga
   - Transición suave

✅ Búsqueda:
   - Reseteador a página 1
   - SIN skeleton
   - Nueva búsqueda fluida

✅ Filtrado:
   - Cambio de pageSize en dropdown
   - SIN saltos extraños de página
   - Nueva carga sin skeleton
```

---

## 📝 Template Base por Copiar

```html
<app-data-table [data]="store.items()" [totalItems]="store.totalItems()" [first]="firstRowIndex()" [config]="tableConfig" [loading]="store.loadingState().initial" [isSaving]="store.loadingState().updating" (onPageChange)="handlePagination($event)" (searchChange)="handleSearch($event)" (deleteAll)="onDeleteAll($event)"> </app-data-table>
```

---

## 🆘 Troubleshooting

### Error: "Cannot find name 'firstRowIndex'"

**Solución**: Asegurar que el computed está definido:

```ts
readonly firstRowIndex = computed(() => {
  const { page = 1, limit = 10 } = this.store.filter();
  return (page - 1) * limit;
});
```

### Error: "[loading] is not a known directive"

**Solución**: Verificar que DataTableComponent está importado en el módulo/standalone:

```ts
@Component({
  imports: [DataTableComponent],  // ← Check
})
```

### Template muestra skeleton infinitamente

**Solución**: En el store, verificar que se marca `hasLoadedOnce`:

```ts
// BaseStore debería tener esto:
private readonly hasLoadedOnce = signal(false);

effect(() => {
  if (!this.hasLoadedOnce() && this.resource.value() !== undefined) {
    this.hasLoadedOnce.set(true);
  }
});
```

### Parpadeo aún existe después de migrar

**Solución**: Asegurar que:

1. BaseStore está usando la **nueva versión** con `hasLoadedOnce`
2. DataTableComponent recibe `[loading]="store.loadingState().initial"`
3. No hay doble capa de loading en el template

---

## 📊 Impacto Esperado

```
Antes de migración:
- Parpadeo de skeleton en cada paginación ❌
- Múltiples computed innecesarios
- Inconsistencia entre módulos

Después de migración:
- UX fluido, sin parpadeos ✅
- Código limpio y consistente
- Mejor rendimiento (menos change detection)
```

---

## ⏱️ Tiempo Estimado

- **Por módulo**: 5-10 minutos
- **Total (14 módulos)**: ~90 minutos
- **Testing manual**: ~30 minutos

---

**Status**: Guía creada  
**Prioridad**: ALTA (mejoraría UX significativamente)  
**Complejidad**: BAJA (repetitivo, pocos cambios)
