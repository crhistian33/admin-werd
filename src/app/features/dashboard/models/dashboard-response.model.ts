// dashboard-response.model.ts

// ── Enums desde Prisma ────────────────────────────────────────

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type ClaimType = 'CANCELLATION' | 'REFUND' | 'REPLACEMENT';

export type ClaimStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

// ── Interfaces ────────────────────────────────────────────────

export interface DashboardKpis {
  totalOrders: number;
  effectiveOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  grossSales: number;
  netSales: number;
  totalRefunded: number;
  pendingPayment: number;
  averageTicket: number;
  totalCustomers: number;
  activeProducts: number;
  pendingReviews: number;
  pendingClaims: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  placedAt: string;
}

export interface OrdersByStatus {
  status: OrderStatus;
  count: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
}

export interface RevenueByDay {
  date: string;
  amount: number;
}

export interface RefundsVsSalesByDay {
  date: string;
  sales: number;
  refunds: number;
}

export interface RecentClaim {
  id: string;
  claimNumber: string;
  type: ClaimType;
  customerName: string;
  status: ClaimStatus;
  createdAt: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  recentOrders: RecentOrder[];
  ordersByStatus: OrdersByStatus[];
  topProducts: TopProduct[];
  revenueByDay: RevenueByDay[];
  refundsVsSales: RefundsVsSalesByDay[];
  recentClaims: RecentClaim[];
}

// Wrapper que devuelve el API
export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface DashboardQueryParams {
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string; // 'YYYY-MM-DD'
}
