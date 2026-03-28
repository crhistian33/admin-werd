export interface ImageVariants {
  original?: string;
  zoom?: string;
  large?: string;
  medium?: string;
  thumb?: string;
  cart?: string;
  tiny?: string;
}

// Registro de imagen confirmada — viene del findAll / findById
export interface ImageRecord {
  id: string;
  imageRole: string;
  url: string | null;
  altText: string | null;
  order: number;
  variants: ImageVariants;
  isSvg: boolean;
}

// Metadata que devuelve el backend al subir al /temp
export interface TempImageMeta {
  width: number;
  height: number;
  size: number;
  format: string;
  mimeType: string;
}

// Respuesta del endpoint POST /images/upload
export interface TempImageResponse {
  imageId: string;
  imageRole: string;
  tempUrl: string;
  metadata: TempImageMeta;
}

// Retorna la URL de display de una imagen
// Prioriza: original → medium → url → null
export function getDisplayUrl(image: ImageRecord): string | null {
  return (
    image.variants?.original ?? image.variants?.medium ?? image.url ?? null
  );
}

// Retorna la primera imagen de un rol específico
export function getImageByRole(
  images: ImageRecord[],
  role: string,
): ImageRecord | null {
  return images.find((img) => img.imageRole === role) ?? null;
}
