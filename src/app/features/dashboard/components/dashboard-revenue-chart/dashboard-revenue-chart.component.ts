import { Component, computed, input } from '@angular/core';
import {
  RevenueByDay,
  RefundsVsSalesByDay,
} from '@features/dashboard/models/dashboard-response.model';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard-revenue-chart',
  imports: [ChartModule],
  templateUrl: './dashboard-revenue-chart.component.html',
  styleUrl: './dashboard-revenue-chart.component.scss',
})
export class DashboardRevenueChartComponent {
  readonly revenue = input<RevenueByDay[]>([]);
  readonly refunds = input<RefundsVsSalesByDay[]>([]);

  readonly chartData = computed(() => {
    // Función auxiliar para normalizar cualquier fecha a "YYYY-MM-DD"
    const toKey = (d: string) => d.split('T')[0];

    const revenue = this.revenue().map((r) => ({ ...r, date: toKey(r.date) }));
    const refunds = this.refunds().map((r) => ({ ...r, date: toKey(r.date) }));

    // Ahora sí, el Set unirá "2026-05-13" con "2026-05-13" correctamente
    const allDates = Array.from(
      new Set([...revenue.map((r) => r.date), ...refunds.map((r) => r.date)]),
    ).sort();

    const revenueMap = new Map(revenue.map((r) => [r.date, r.amount]));
    const salesMap = new Map(refunds.map((r) => [r.date, r.sales]));
    const refundsMap = new Map(refunds.map((r) => [r.date, r.refunds]));

    return {
      labels: allDates.map((d) => {
        const parts = d.split('-');
        return `${parts[2]}/${parts[1]}`; // Retorna "13/05"
      }),
      datasets: [
        {
          label: 'Ingresos',
          data: allDates.map((d) => {
            const dailySales = salesMap.get(d) ?? 0;
            const dailyRefunds = refundsMap.get(d) ?? 0;
            return dailySales - dailyRefunds;
          }),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.08)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Ventas',
          data: allDates.map((d) => salesMap.get(d) ?? 0),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.08)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Reembolsos',
          data: allDates.map((d) => refundsMap.get(d) ?? 0),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  });

  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748b', usePointStyle: true, padding: 16 },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { callback: (v: number) => `S/ ${v}` },
      },
    },
  };
}
