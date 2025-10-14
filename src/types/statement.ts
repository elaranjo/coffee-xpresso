export type ProductType = 'business_account' | 'expense_management' | 'suppliers';

export type TransactionDirection = 'credit' | 'debit';

export interface Transaction {
  id: string;
  date: string; // ISO 8601
  description: string;
  category?: string;
  amount: number;
  direction: TransactionDirection;
  status?: 'completed' | 'pending' | 'scheduled';
  responsible?: string;
  productType?: ProductType;
  productName?: string;
  counterparty?: string;
}

export interface StatementPeriod {
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}

export interface StatementPayload {
  period: StatementPeriod;
  productType?: ProductType;
  transactions: Transaction[];
  openingBalance?: number;
  closingBalance?: number;
  currency?: string;
  lastUpdatedAt?: string;
  totalCount?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  nextPage?: number;
  prevPage?: number;
}

export interface StatementFilters {
  startDate: string;
  endDate: string;
  productType?: ProductType;
  page?: number;
  limit?: number;
}

export type ProductView = 'all' | ProductType;

export interface MonthlyAggregatedData {
  monthLabel: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  transactions: Transaction[];
}

export interface DailySeriesPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}
