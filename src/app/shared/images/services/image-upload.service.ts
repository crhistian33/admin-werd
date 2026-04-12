import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TempImageResponse } from '../interfaces/image.interface';
import { ApiResponse } from '@shared/models/api-response.model';

export type ImageEntityKey =
  | 'product'
  | 'category'
  | 'brand'
  | 'hero_slide'
  | 'site_config'
  | 'user';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/images`;

  // Sube una imagen al directorio /temp del backend
  // Retorna el registro temporal con el id que se enviará
  // en el create/update del módulo como tempImageId
  uploadTemp(
    file: File,
    entityKey: ImageEntityKey,
    imageRole: string,
  ): Observable<ApiResponse<TempImageResponse>> {
    const formData = new FormData();

    formData.append('file', file);

    // Enviar entityKey e imageRole como HttpParams
    const params = new HttpParams()
      .set('entityKey', entityKey)
      .set('imageRole', imageRole);

    return this.http.post<ApiResponse<TempImageResponse>>(
      `${this.baseUrl}/upload`,
      formData,
      { params },
    );
  }

  // Elimina una imagen temp del backend (limpieza proactiva)
  // Si el usuario sube una imagen a galería y luego la quita antes de guardar,
  // se elimina del /temp para no dejar archivos huérfanos.
  // Si falla, el cron de limpieza la eliminará eventualmente.
  deleteTempById(imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${imageId}`);
  }
}
