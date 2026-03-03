export type BreadcrumbItem = {
  label: string;
  route?: string;
  active?: boolean; // último ítem
  group?: boolean; // ítem agrupador sin ruta (Ventas)
};
