import { Component, computed, input } from '@angular/core';
import {
  OrdersByStatus,
  OrderStatus,
} from '@features/dashboard/models/dashboard-response.model';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ORDER_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Pendiente de Pago',
  paid: 'Pagado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

@Component({
  selector: 'app-dashboard-orders-by-status',
  imports: [ChartModule],
  templateUrl: './dashboard-orders-by-status.component.html',
  styleUrl: './dashboard-orders-by-status.component.scss',
})
export class DashboardOrdersByStatusComponent {
  readonly data = input<OrdersByStatus[]>([]);

  readonly plugins = [ChartDataLabels];

  readonly chartData = computed(() => {
    return {
      labels: this.data().map((d) => ORDER_LABEL[d.status]),
      datasets: [
        {
          data: this.data().map((d) => d.count),
          backgroundColor: [
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#3b82f6',
            '#8b5cf6',
            '#6b7280',
          ],
          borderWidth: 0,
        },
      ],
    };
  });

  readonly chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 16 },
      },
      datalabels: {
        color: '#fff',
        formatter: (value: number, ctx: any) => {
          const dataset = ctx.chart.data.datasets[0];
          const total = dataset.data.reduce(
            (acc: number, val: number) => acc + val,
            0,
          );
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        font: {
          weight: 'bold',
          size: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce(
              (acc: number, val: number) => acc + val,
              0,
            );
            const value = dataset.data[tooltipItem.dataIndex];
            const percentage = ((value / total) * 100).toFixed(1);
            const label = tooltipItem.label || '';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };
}
