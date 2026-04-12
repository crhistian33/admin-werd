import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { MOCK_HANDLERS } from '@core/mocks/mock-handlers';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMocks) return next(req);

  const path = new URL(req.url).pathname; // → '/api/categories/2'
  const handler = MOCK_HANDLERS.find((h) => {
    const samePath = path === h.url || path.startsWith(h.url + '/');
    const sameMethod = req.method === h.method;
    return samePath && sameMethod;
  });

  if (!handler) return next(req);

  // POST — crear
  if (req.method === 'POST') {
    const newItem = { ...(req.body as any), id: Date.now() };
    (handler.data as any[]).push(newItem);
    return of(new HttpResponse({ status: 201, body: newItem })).pipe(
      delay(400),
    );
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const pattern = new RegExp(`${handler.url}/(\\d+)$`);
    const match = path.match(pattern);

    if (match) {
      const id = parseInt(match[1], 10);
      const list = handler.data as any[];
      const index = list.findIndex((i) => i.id === id);

      if (index === -1) {
        return timer(400).pipe(
          switchMap(() =>
            throwError(
              () =>
                new HttpErrorResponse({
                  status: 404,
                  statusText: 'Not Found',
                  url: req.url,
                }),
            ),
          ),
        );
      }

      list[index] =
        req.method === 'PATCH'
          ? { ...list[index], ...(req.body as any) } // merge — mantiene campos no enviados
          : { ...(req.body as any), id }; // reemplaza — solo conserva el id

      return of(new HttpResponse({ status: 200, body: list[index] })).pipe(
        delay(400),
      );
    }
  }

  // DELETE
  if (req.method === 'DELETE') {
    const deletePattern = new RegExp(`${handler.url}/(\\d+)$`);
    const deleteMatch = path.match(deletePattern);

    if (deleteMatch) {
      // Single delete
      const id = parseInt(deleteMatch[1], 10);
      const list = handler.data as any[];
      const index = list.findIndex((i) => i.id === id);

      if (index === -1) {
        return timer(400).pipe(
          switchMap(() =>
            throwError(
              () =>
                new HttpErrorResponse({
                  status: 404,
                  statusText: 'Not Found',
                  url: req.url,
                }),
            ),
          ),
        );
      }

      list.splice(index, 1);
      return of(new HttpResponse({ status: 204, body: null })).pipe(delay(400));
    } else if (path === handler.url) {
      // Bulk delete
      const idsToDelete = req.body as number[];
      if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
        const list = handler.data as any[];
        // Remove all items whose ID is in the idsToDelete array
        for (let i = list.length - 1; i >= 0; i--) {
          if (idsToDelete.includes(list[i].id)) {
            list.splice(i, 1);
          }
        }
        return of(new HttpResponse({ status: 204, body: null })).pipe(
          delay(400),
        );
      }
    }
  }

  // GET detalle
  let body = handler.data;
  const detailPattern = new RegExp(`${handler.url}/(\\d+)$`);
  const match = path.match(detailPattern);

  if (match) {
    const id = parseInt(match[1], 10);
    const item = (handler.data as any[]).find((i) => i.id === id);
    if (!item) {
      return timer(400).pipe(
        switchMap(() =>
          throwError(
            () =>
              new HttpErrorResponse({
                status: 404,
                statusText: 'Not Found',
                url: req.url,
              }),
          ),
        ),
      );
    }
    body = item;
  }

  return of(new HttpResponse({ status: 200, body })).pipe(delay(400));
};
