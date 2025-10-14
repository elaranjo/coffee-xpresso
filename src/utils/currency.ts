import type { Transaction } from '../types/statement';

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

export function formatCurrency(value: number, currency = 'BRL') {
  const cacheKey = `${currency}-pt-BR`;
  if (!currencyFormatterCache.has(cacheKey)) {
    currencyFormatterCache.set(
      cacheKey,
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
      }),
    );
  }
  const formatter = currencyFormatterCache.get(cacheKey)!;
  return formatter.format(value);
}

export function getSignedAmount(transaction: Transaction) {
  const absolute = Math.abs(transaction.amount);
  if (transaction.direction === 'debit') {
    return -absolute;
  }
  return absolute;
}

