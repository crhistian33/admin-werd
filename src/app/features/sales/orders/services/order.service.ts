import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import type { Order } from '../models/order.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/orders`;

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }
}
