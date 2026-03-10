import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { environment } from '@env/environment';
import { MOCK_HANDLERS } from '@core/mocks/mock-handlers';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMocks) return next(req);

  // Encontrar el handler que coincida con la base de la URL
  const handler = MOCK_HANDLERS.find((h) => req.url.includes(h.url) && req.method === h.method);

  if (!handler) return next(req);

  let body = handler.data;

  // Si la petición es para un detalle (ej: /api/categories/1)
  const isDetailPattern = new RegExp(`${handler.url}/(\\d+)$`);
  const match = req.url.match(isDetailPattern);

  if (match && match[1]) {
    const id = parseInt(match[1], 10);
    // Asumimos que handler.data es un array y buscamos por id
    const item = (handler.data as any[]).find((i) => i.id === id);
    if (!item) {
      return of(new HttpResponse({ status: 404, statusText: 'Not Found' })).pipe(delay(400));
    }
    body = item;
  }

  return of(new HttpResponse({ status: 200, body })).pipe(
    delay(400), // simula latencia real
  );
};
