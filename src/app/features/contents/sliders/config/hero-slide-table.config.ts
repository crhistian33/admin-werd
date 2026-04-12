import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { HeroSlide } from '../models/hero-slide.model';
import { environment } from '@env/environment';

type HeroSlideTableCallbacks = {
  onDelete: (heroSlide: HeroSlide) => void;
};

export const heroSlideTableConfig = (
  router: Router,
  callback: HeroSlideTableCallbacks,
): DataTableConfig<HeroSlide> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: true,
  columns: [
    {
      field: 'images',
      header: 'Imagen',
      type: 'image',
      width: '100px',
      format: (val, row: any) => {
        const thumb = row.images?.[0]?.variants?.thumb;
        if (!thumb) return null;
        return thumb.startsWith('http')
          ? thumb
          : `${environment.apiImagesUrl}${thumb}`;
      },
    },
    {
      field: 'title',
      header: 'Título',
      type: 'text',
      sortable: true,
    },
    {
      field: 'linkType',
      header: 'Tipo de enlace',
      type: 'badge',
      sortable: true,
      width: '200px',
      badges: [
        { value: 'product', label: 'Producto', severity: 'success' },
        { value: 'category', label: 'Categoría', severity: 'info' },
        { value: 'external', label: 'Externo', severity: 'warn' },
        { value: 'none', label: 'Ninguno', severity: 'danger' },
      ],
      filter: {
        enabled: true,
        type: 'select',
        options: [
          { label: 'Producto', value: 'product' },
          { label: 'Categoría', value: 'category' },
          { label: 'Externo', value: 'external' },
          { label: 'Ninguno', value: 'none' },
        ],
      },
    },
    {
      field: 'sortOrder',
      header: 'Orden',
      type: 'number',
      sortable: true,
      width: '100px',
    },
    {
      field: 'isActive',
      header: 'Estado',
      type: 'badge',
      sortable: true,
      width: '130px',
      badges: [
        { value: 'true', label: 'Activo', severity: 'success' },
        { value: 'false', label: 'Inactivo', severity: 'danger' },
      ],
      filter: {
        enabled: true,
        type: 'boolean',
        options: [
          { label: 'Activo', value: 'true' },
          { label: 'Inactivo', value: 'false' },
        ],
      },
    },
    {
      field: 'createdBy.name',
      header: 'Creado por',
      type: 'text',
      width: '180px',
    },
    { field: 'actions', header: '', type: 'actions', width: '80px' },
  ],
  actions: [
    {
      icon: 'pi pi-eye',
      tooltip: 'Ver producto',
      severity: 'info',
      action: (row) => router.navigate(['/contenidos/destacados', row.id]),
    },
    {
      icon: 'pi pi-pencil',
      tooltip: 'Editar',
      severity: 'warn',
      action: (row) =>
        router.navigate(['/contenidos/destacados', row.id, 'editar']),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
      severity: 'danger',
      action: (row) => callback.onDelete(row),
    },
  ],
});
