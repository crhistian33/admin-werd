import { Component, input } from '@angular/core';
import { TopProduct } from '@features/dashboard/models/dashboard-response.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard-top-products',
  imports: [TableModule],
  templateUrl: './dashboard-top-products.component.html',
  styleUrl: './dashboard-top-products.component.scss',
})
export class DashboardTopProductsComponent {
  readonly products = input<TopProduct[]>([]);
}
