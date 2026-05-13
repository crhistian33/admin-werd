import { Component, computed, inject, signal } from '@angular/core';
import { DashboardStore } from '@features/dashboard/store/dashboard.store';
import { DashboardKpiCardsComponent } from '@features/dashboard/components/dashboard-kpi-cards/dashboard-kpi-cards.component';
import { DashboardRecentOrdersComponent } from '@features/dashboard/components/dashboard-recent-orders/dashboard-recent-orders.component';
import { DashboardOrdersByStatusComponent } from '@features/dashboard/components/dashboard-orders-by-status/dashboard-orders-by-status.component';
import { DashboardRevenueChartComponent } from '@features/dashboard/components/dashboard-revenue-chart/dashboard-revenue-chart.component';
import { DashboardTopProductsComponent } from '@features/dashboard/components/dashboard-top-products/dashboard-top-products.component';
import { DashboardRecentClaimsComponent } from '@features/dashboard/components/dashboard-recent-claims/dashboard-recent-claims.component';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

interface PeriodOption {
  label: string;
  days: number | null;
  text: string;
}

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule,
    SkeletonModule,
    SelectButtonModule,
    DashboardKpiCardsComponent,
    DashboardRecentOrdersComponent,
    DashboardOrdersByStatusComponent,
    DashboardRevenueChartComponent,
    DashboardTopProductsComponent,
    DashboardRecentClaimsComponent,
    FormsModule,
    DatePickerModule,
    TooltipModule,
  ],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly store = inject(DashboardStore);
  private readonly datePipe = inject(DatePipe);

  // readonly periods: PeriodOption[] = [
  //   { label: '7D', days: 7, text: 'Última semana' },
  //   { label: '30D', days: 30, text: 'Último mes' },
  //   { label: '90D', days: 90, text: 'Últimos 3 meses' },
  //   { label: '1 año', days: 365, text: 'Último año' },
  //   { label: 'Todo', days: 3650, text: 'Todo el historial' },
  //   { label: 'Custom', days: null, text: 'Rango personalizado' },
  // ];

  //selectedDays = 30;
  //showCustomRange = false;
  customStart: Date | null = null;
  customEnd: Date | null = null;

  //readonly selectedPeriod = signal(this.periods[1]);

  readonly rangeLabel = computed(() => {
    const r = this.store.dateRange();
    const startDate = this.datePipe.transform(r.startDate, 'dd/MM/yyyy');
    const endDate = this.datePipe.transform(r.endDate, 'dd/MM/yyyy');
    const label =
      startDate === endDate ? startDate : `${startDate} al ${endDate}`;
    return label;
  });

  // onPeriodChange(event: any): void {
  //   const period = this.periods.find((p) => p.days === event.value);
  //   if (!period) return;
  //   this.selectedPeriod.set(period);

  //   if (period.days === null) {
  //     this.showCustomRange = true;
  //   } else {
  //     this.showCustomRange = false;
  //     this.store.setPreset(period.days);
  //   }
  // }

  applyCustomRange(): void {
    if (!this.customStart) return;

    if (!this.customEnd) this.customEnd = this.customStart;

    // Función para obtener YYYY-MM-DD local sin desfase UTC
    const toLocalISO = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    this.store.setCustomRange(
      toLocalISO(this.customStart),
      toLocalISO(this.customEnd),
    );

    // Actualizamos el label visual del periodo seleccionado
    // const customPeriod = this.periods.find((p) => p.days === null);
    // if (customPeriod) this.selectedPeriod.set(customPeriod);
  }

  onReset() {
    this.store.reset();
    this.customStart = null;
    this.customEnd = null;
  }
}
