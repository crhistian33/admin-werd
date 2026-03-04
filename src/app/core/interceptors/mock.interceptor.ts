import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { environment } from '@env/environment';
import { MOCK_HANDLERS } from '@core/mocks/mock-handlers';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMocks) return next(req);

  const handler = MOCK_HANDLERS.find(
    (h) => req.url.includes(h.url) && req.method === h.method,
  );

  if (!handler) return next(req);

  return of(new HttpResponse({ status: 200, body: handler.data })).pipe(
    delay(400), // simula latencia real
  );
};
