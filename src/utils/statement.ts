import type { DailySeriesPoint, ProductView, Transaction } from '../types/statement';
import { parseISO } from './date';
import { getSignedAmount } from './currency';

export interface StatementTotals {
  income: number;
  expense: number;
  net: number;
  count: number;
}

export function calculateTotals(transactions: Transaction[]): StatementTotals {
  return transactions.reduce<StatementTotals>(
    (acc, transaction) => {
      const signed = getSignedAmount(transaction);
      if (signed >= 0) {
        acc.income += signed;
      } else {
        acc.expense += Math.abs(signed);
      }
      acc.net = acc.income - acc.expense;
      acc.count += 1;
      return acc;
    },
    { income: 0, expense: 0, net: 0, count: 0 },
  );
}

export function filterTransactionsByProduct(
  transactions: Transaction[],
  productView: ProductView,
): Transaction[] {
  if (productView === 'all') {
    return transactions;
  }
  return transactions.filter((transaction) => transaction.productType === productView);
}

export function buildDailyExpenseSeries(
  transactions: Transaction[],
): DailySeriesPoint[] {
  if (!transactions.length) {
    return [];
  }

  const map = new Map<string, number>();

  transactions.forEach((transaction) => {
    if (transaction.direction !== 'debit') {
      return;
    }
    const dateKey = parseISO(transaction.date).format('YYYY-MM-DD');
    const current = map.get(dateKey) ?? 0;
    map.set(dateKey, current + Math.abs(getSignedAmount(transaction)));
  });

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));
}

export function buildDailyIncomeSeries(transactions: Transaction[]): DailySeriesPoint[] {
  if (!transactions.length) {
    return [];
  }

  const map = new Map<string, number>();

  transactions.forEach((transaction) => {
    if (transaction.direction !== 'credit') {
      return;
    }
    const dateKey = parseISO(transaction.date).format('YYYY-MM-DD');
    const current = map.get(dateKey) ?? 0;
    map.set(dateKey, current + Math.abs(getSignedAmount(transaction)));
  });

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));
}
