import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DashboardKpis } from '@features/dashboard/models/dashboard-response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-kpi-cards',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './dashboard-kpi-cards.component.html',
  styleUrl: './dashboard-kpi-cards.component.scss',
})
export class DashboardKpiCardsComponent {
  readonly kpis = input<DashboardKpis | null | undefined>();
}
