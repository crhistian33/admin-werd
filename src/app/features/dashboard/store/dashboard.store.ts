import { Injectable, computed, signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DashboardService } from '../services/dashboard.service';

export interface DateRange {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
}

const toISO = (d: Date): string => d.toISOString().split('T')[0];

const last = (days: number): DateRange => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { startDate: toISO(start), endDate: toISO(end) };
};

const currentYear = (): DateRange => {
  const now = new Date();
  // Primer día del año actual
  const start = new Date(now.getFullYear(), 0, 1);
  return { startDate: toISO(start), endDate: toISO(now) };
};

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly service = inject(DashboardService);

  // Por defecto: último mes
  readonly dateRange = signal<DateRange>(currentYear());

  private readonly resource = rxResource({
    params: () => this.dateRange(),
    stream: (ctx) => this.service.getDashboard(ctx.params),
  });

  readonly isLoading = this.resource.isLoading;
  readonly hasValue = computed(() => this.resource.value() !== undefined);

  readonly kpis = computed(() => this.resource.value()?.kpis ?? null);
  readonly recentOrders = computed(
    () => this.resource.value()?.recentOrders ?? [],
  );
  readonly ordersByStatus = computed(
    () => this.resource.value()?.ordersByStatus ?? [],
  );
  readonly topProducts = computed(
    () => this.resource.value()?.topProducts ?? [],
  );
  readonly revenueByDay = computed(
    () => this.resource.value()?.revenueByDay ?? [],
  );
  readonly refundsVsSales = computed(
    () => this.resource.value()?.refundsVsSales ?? [],
  );
  readonly recentClaims = computed(
    () => this.resource.value()?.recentClaims ?? [],
  );

  refresh(): void {
    this.resource.reload();
  }

  setPreset(days: number): void {
    this.dateRange.set(last(days));
  }

  setCustomRange(startDate: string, endDate: string): void {
    this.dateRange.set({ startDate, endDate });
  }

  reset(): void {
    this.dateRange.set(currentYear());
  }
}
