import { useMemo } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchStatement } from '../services/statementService';
import type { StatementFilters } from '../types/statement';

export const DEFAULT_STATEMENT_FILTERS: StatementFilters = {
  startDate: '2025-07-01',
  endDate: '2025-09-30',
  page: 1,
  limit: 10,
};

export function useStatement(filters?: Partial<StatementFilters>) {
  const mergedFilters = useMemo<StatementFilters>(
    () => ({
      ...DEFAULT_STATEMENT_FILTERS,
      ...(filters ?? {}),
    }),
    [filters],
  );

  return useQuery({
    queryKey: [
      'statement',
      mergedFilters.startDate,
      mergedFilters.endDate,
      mergedFilters.productType ?? 'all',
      mergedFilters.page ?? DEFAULT_STATEMENT_FILTERS.page,
      mergedFilters.limit ?? DEFAULT_STATEMENT_FILTERS.limit,
    ],
    queryFn: ({ signal }) => fetchStatement(mergedFilters, signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30,
    placeholderData: keepPreviousData,
  });
}
