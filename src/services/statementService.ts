import { z } from 'zod';

import { statementMock } from '../mocks/statement-mock';
import type {
  StatementFilters,
  StatementPayload,
  Transaction,
  TransactionDirection,
} from '../types/statement';

const DEFAULT_API_BASE_URL =
  'https://espresso-banking-api-q3-2025-bb3079ecefeb.herokuapp.com';
const apiBaseFromEnv =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_API_BASE_URL;
const API_BASE_URL = apiBaseFromEnv.replace(/\/$/, '');
const STATEMENTS_ENDPOINT = `${API_BASE_URL}/statements`;

const recordSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    date: z.string().optional(),
    created_at: z.string().optional(),
    occurred_at: z.string().optional(),
    description: z.string().optional(),
    title: z.string().optional(),
    summary: z.string().optional(),
    category: z.string().optional(),
    category_name: z.string().optional(),
    amount: z.union([z.number(), z.string()]).optional(),
    value: z.union([z.number(), z.string()]).optional(),
    transactionAmount: z.union([z.number(), z.string()]).optional(),
    type: z.string().optional(),
    transaction_type: z.string().optional(),
    transaction_date: z.string().optional(),
    username: z.string().optional(),
    direction: z.string().optional(),
    status: z.string().optional(),
    opening_balance: z.union([z.number(), z.string()]).optional(),
    closing_balance: z.union([z.number(), z.string()]).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    attributes: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

const responseSchema = z
  .object({
    data: z.array(recordSchema).optional(),
    transactions: z.array(recordSchema).optional(),
    results: z.array(recordSchema).optional(),
    statement: z.array(recordSchema).optional(),
    opening_balance: z.union([z.number(), z.string()]).optional(),
    closing_balance: z.union([z.number(), z.string()]).optional(),
    openingBalance: z.union([z.number(), z.string()]).optional(),
    closingBalance: z.union([z.number(), z.string()]).optional(),
    period: z
      .object({
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .optional(),
    currency: z.string().optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

function buildUrl(filters: StatementFilters) {
  const params = new URLSearchParams();
  params.set('start_date', filters.startDate);
  params.set('end_date', filters.endDate);
  if (filters.productType) {
    params.set('product_type', filters.productType);
  }
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 100));
  return `${STATEMENTS_ENDPOINT}?${params.toString()}`;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const normalizedString = value.replace(/[^\d,-]+/g, '').replace(',', '.');
    const normalized = Number(normalizedString);
    return Number.isFinite(normalized) ? normalized : fallback;
  }
  return fallback;
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : undefined;
  }
  return undefined;
}

function inferDirection(rawDirection: unknown, amount: number): TransactionDirection {
  if (typeof rawDirection === 'string') {
    const normalized = rawDirection.toLowerCase();
    if (/(credit|entrada|in|income|receb)/.test(normalized)) {
      return 'credit';
    }
    if (/(debit|saída|saida|out|expense|pag)/.test(normalized)) {
      return 'debit';
    }
  }
  return amount >= 0 ? 'credit' : 'debit';
}

function mapTransaction(raw: z.infer<typeof recordSchema>): Transaction | null {
  const base =
    raw.attributes && typeof raw.attributes === 'object'
      ? ({ ...raw, ...raw.attributes } as Record<string, unknown>)
      : raw;

  const amountCandidate =
    base.amount ?? base.value ?? base.transactionAmount ?? base.total ?? 0;
  const amount = toNumber(amountCandidate);
  const direction = inferDirection(
    (base.direction ?? base.type ?? base.transaction_type) as string | undefined,
    amount,
  );

  const date = (
    base.date ??
    base.created_at ??
    base.transaction_date ??
    base.occurred_at ??
    ''
  ) as string | undefined;
  if (!date) {
    return null;
  }

  const description = String(
    base.description ?? base.title ?? base.summary ?? 'Transação',
  );

  const category =
    typeof base.category === 'string'
      ? base.category
      : typeof base.category_name === 'string'
        ? base.category_name
        : undefined;

  const responsible =
    typeof base.responsible === 'string'
      ? base.responsible
      : typeof base.responsible_name === 'string'
        ? base.responsible_name
        : typeof base.username === 'string'
          ? base.username
          : undefined;

  const productTypeCandidate = base.product_type ?? base.productType ?? base.product_code;
  const productType =
    typeof productTypeCandidate === 'string'
      ? (productTypeCandidate as Transaction['productType'])
      : undefined;

  const productName =
    typeof base.product_name === 'string'
      ? base.product_name
      : typeof base.productName === 'string'
        ? base.productName
        : undefined;

  return {
    id: String(base.id ?? `${date}-${description}`),
    date,
    description,
    category,
    amount: Math.abs(amount),
    direction,
    status: (base.status as Transaction['status']) ?? 'completed',
    responsible,
    productType,
    productName,
  };
}

type PeriodSource = {
  startDate?: string;
  endDate?: string;
  start_date?: string;
  end_date?: string;
};

function normalizePayload(
  raw: unknown,
  fallback: StatementPayload,
  filters: StatementFilters,
): StatementPayload {
  const parsed = responseSchema.safeParse(raw);
  if (!parsed.success) {
    return fallback;
  }

  const source = parsed.data;
  const list =
    source.transactions ?? source.data ?? source.results ?? source.statement ?? [];
  const transactions = list
    .map((item) => mapTransaction(item))
    .filter((item): item is Transaction => Boolean(item))
    .sort((a, b) => b.date.localeCompare(a.date));

  const periodSource = (source.period as PeriodSource | undefined) ?? undefined;
  const startDate =
    periodSource?.startDate ?? periodSource?.start_date ?? filters.startDate;
  const endDate = periodSource?.endDate ?? periodSource?.end_date ?? filters.endDate;

  const metaSource = (source.meta ?? source.metadata) as Record<string, unknown> | undefined;
  const paginationSource =
    metaSource && typeof metaSource === 'object' && 'pagination' in metaSource
      ? (metaSource.pagination as Record<string, unknown>)
      : undefined;

  const totalCandidate =
    metaSource?.total ??
    metaSource?.count ??
    paginationSource?.total ??
    paginationSource?.count;
  const totalCount =
    parseOptionalNumber(totalCandidate) ?? transactions.length ?? filters.limit ?? 0;

  const pageMeta =
    parseOptionalNumber(metaSource?.page ?? paginationSource?.page ?? paginationSource?.current) ??
    filters.page ?? 1;
  const limitMeta =
    parseOptionalNumber(metaSource?.limit ?? paginationSource?.limit ?? metaSource?.per_page) ??
    filters.limit ??
    100;
  const totalPagesMeta =
    parseOptionalNumber(metaSource?.pages ?? paginationSource?.pages ?? metaSource?.last ?? paginationSource?.last) ??
    undefined;
  const nextPageMeta = parseOptionalNumber(metaSource?.next ?? paginationSource?.next);
  const prevPageMeta = parseOptionalNumber(metaSource?.prev ?? paginationSource?.prev);

  return {
    period: {
      startDate,
      endDate,
    },
    productType: filters.productType,
    transactions,
    totalCount,
    page: pageMeta,
    limit: limitMeta,
    totalPages: totalPagesMeta,
    nextPage: nextPageMeta ?? undefined,
    prevPage: prevPageMeta ?? undefined,
    openingBalance: toNumber(
      source.openingBalance ?? source.opening_balance,
      fallback.openingBalance ?? 0,
    ),
    closingBalance: toNumber(
      source.closingBalance ?? source.closing_balance,
      fallback.closingBalance ?? 0,
    ),
    currency: typeof source.currency === 'string' ? source.currency : fallback.currency,
    lastUpdatedAt: fallback.lastUpdatedAt,
  };
}

export async function fetchStatement(
  filters: StatementFilters,
  signal?: AbortSignal,
): Promise<StatementPayload> {
  try {
    const response = await fetch(buildUrl(filters), { signal });
    if (!response.ok) {
      console.warn(
        `Statement API responded with status ${response.status}. Using fallback data.`,
      );
      return statementMock;
    }

    const raw = await response.json();
    return normalizePayload(raw, statementMock, filters);
  } catch (error) {
    console.warn('Failed to fetch statement from remote API. Falling back to mock.', error);
    return statementMock;
  }
}
