export type DetailFieldType =
  | 'text'
  | 'date'
  | 'badge'
  | 'boolean'
  | 'number'
  | 'currency'
  | 'count'
  | 'html'
  | 'image' // imagen única
  | 'logo' // logo de la marca
  | 'gallery' // galería con thumbnails (p-galleria)
  | 'specs' // tabla key/value — { specKey, specValue }[]
  | 'features' // lista con check icons — { feature }[]
  | 'price-block'; // bloque precio + costo + margen calculado

export interface BadgeOption {
  value: any;
  label: string;
  severity: 'success' | 'danger' | 'warn' | 'info' | 'secondary';
}

export interface DetailFieldConfig {
  // Clave del objeto — soporta dot notation: 'category.name', '_count.products'
  key: string;
  label: string;
  type: DetailFieldType;

  // Para type badge | boolean
  badges?: BadgeOption[];

  // Para type date
  dateFormat?: string; // default: 'dd/MM/yyyy'

  // Para type currency | price-block
  currencySymbol?: string; // default: 'S/ '

  // Para type image | gallery
  // Si no se provee usa environment.apiImagesUrl
  imageBaseUrl?: string;

  // Para type price-block — claves del objeto donde están precio y costo
  priceKey?: string; // default: 'price.price'
  costKey?: string; // default: 'price.cost'
  compareKey?: string; // default: 'price.compareAtPrice'

  // Para type specs — clave del array en el objeto
  // default: 'specs', items con { specKey, specValue }
  specsKey?: string;

  // Para type features — clave del array en el objeto
  // default: 'features', items con { feature }
  featuresKey?: string;

  // Transformación personalizada del valor antes de mostrarlo
  format?: (value: any, item: Record<string, any>) => string;

  // Para mostrar u ocultar según condición del objeto
  visible?: (item: Record<string, any>) => boolean;
}

// ── Sección ───────────────────────────────────────────────────────

export type DetailSectionLayout =
  | 'info' // lista label/valor — columna
  | 'image' // imagen única — card
  | 'gallery' // galería con thumbnails — card
  | 'specs' // tabla key/value — card
  | 'features' // lista con checks — card
  | 'price' // bloque de precios — card
  | 'html' // contenido richtext — card full-width
  | 'tags'; // fila de badges

export interface DetailSectionConfig {
  title?: string;
  layout: DetailSectionLayout;
  fields: DetailFieldConfig[];

  // Cuántas columnas ocupa en el grid de 2 columnas
  // 1 = media pantalla, 2 = full width
  // default: 1
  span?: 1 | 2;
}

export interface DetailViewConfig {
  // Secciones en orden — el grid es de 2 columnas
  // span=2 ocupa toda la fila
  sections: DetailSectionConfig[];
}
