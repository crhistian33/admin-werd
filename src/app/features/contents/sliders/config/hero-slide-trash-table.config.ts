import { Router } from '@angular/router';
import { DataTableConfig } from '@shared/types/data-table.type';
import { HeroSlide } from '../models/hero-slide.model';

type HeroSlideTableCallbacks = {
  onDelete: (heroSlide: HeroSlide) => void;
  onRestore: (heroSlide: HeroSlide) => void;
};

export const heroSlideTrahsTableConfig = (
  router: Router,
  callbacks: HeroSlideTableCallbacks,
): DataTableConfig<HeroSlide> => ({
  dataKey: 'id',
  globalFilter: true,
  selectable: true,
  showFilter: true,
  isTrashView: true,
  showCreate: false,
  showDeleteAll: true,
  columns: [
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
    },
    {
      field: 'deletedBy.name',
      header: 'Eliminado por',
      type: 'text',
      width: '180px',
    },
    { field: 'actions', header: '', type: 'actions', width: '80px' },
  ],
  actions: [
    {
      icon: 'pi pi-refresh',
      tooltip: 'Restaurar',
      severity: 'success',
      action: (row) => callbacks.onRestore(row),
    },
    {
      icon: 'pi pi-trash',
      tooltip: 'Eliminar',
      severity: 'danger',
      action: (row) => callbacks.onDelete(row),
    },
  ],
});
