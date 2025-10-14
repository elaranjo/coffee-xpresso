import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';

import { StatementTemplate } from '../components/templates/StatementTemplate';
import { StatementLineChart } from '../components/organisms/StatementLineChart';
import { TransactionsTable } from '../components/organisms/TransactionsTable';
import { StatementHeader } from '../components/molecules/StatementHeader';
import { DEFAULT_STATEMENT_FILTERS, useStatement } from '../hooks/useStatement';
import type { ProductView } from '../types/statement';
import {
  calculateTotals,
  filterTransactionsByProduct,
  buildDailyExpenseSeries,
  buildDailyIncomeSeries,
} from '../utils/statement';
import { formatDate, getMonthBoundaries } from '../utils/date';
import { Icon } from '../components/atoms/Icon';
import { DEFAULT_ICON_COLOR, PRODUCT_ICON_NAME, SELECTED_ICON_COLOR } from '../constants/icons';

type MonthFilterOption = {
  key: string;
  label: string;
  startDate: string;
  endDate: string;
};

const BASE_MONTHS = ['2025-07-01', '2025-08-01', '2025-09-01'] as const;

function formatMonthLabel(isoDate: string) {
  const raw = formatDate(isoDate, 'MMMM YYYY');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

const MONTH_FILTERS: MonthFilterOption[] = BASE_MONTHS.map((isoDate) => {
    const { start, end } = getMonthBoundaries(isoDate);
    return {
      key: start.slice(0, 7),
      label: formatMonthLabel(isoDate),
      startDate: start,
      endDate: end,
    };
});

const MONTH_SELECTOR_OPTIONS = MONTH_FILTERS.map(({ key, label }) => ({ key, label }));

const INITIAL_MONTH_FILTER: MonthFilterOption = MONTH_FILTERS[0] ?? {
  key: DEFAULT_STATEMENT_FILTERS.startDate.slice(0, 7),
  label: formatMonthLabel(DEFAULT_STATEMENT_FILTERS.startDate),
  startDate: DEFAULT_STATEMENT_FILTERS.startDate,
  endDate: DEFAULT_STATEMENT_FILTERS.endDate,
};

const PRODUCT_FILTER_OPTIONS: Array<{ value: ProductView; label: string; icon: (selected: boolean) => ReactElement }> = [
  {
    value: 'all',
    label: 'Visão geral',
    icon: (selected) => (
      <Icon
        name="checkmark-line"
        size={20}
        color={selected ? SELECTED_ICON_COLOR : DEFAULT_ICON_COLOR}
        aria-hidden
      />
    ),
  },
  {
    value: 'business_account',
    label: 'Conta empresarial',
    icon: (selected) => (
      <Icon
        name={PRODUCT_ICON_NAME.business_account}
        size={20}
        color={selected ? SELECTED_ICON_COLOR : DEFAULT_ICON_COLOR}
        aria-hidden
      />
    ),
  },
  {
    value: 'expense_management',
    label: 'Gestão de despesas',
    icon: (selected) => (
      <Icon
        name={PRODUCT_ICON_NAME.expense_management}
        size={20}
        color={selected ? SELECTED_ICON_COLOR : DEFAULT_ICON_COLOR}
        aria-hidden
      />
    ),
  },
  {
    value: 'suppliers',
    label: 'Fornecedores',
    icon: (selected) => (
      <Icon
        name={PRODUCT_ICON_NAME.suppliers}
        size={20}
        color={selected ? SELECTED_ICON_COLOR : DEFAULT_ICON_COLOR}
        aria-hidden
      />
    ),
  },
];

export function StatementPage() {
  const initialMonth = useMemo(() => INITIAL_MONTH_FILTER, []);
  const [productView, setProductView] = useState<ProductView>('all');
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(initialMonth.key);
  const [queryFilters, setQueryFilters] = useState(() => ({
    ...DEFAULT_STATEMENT_FILTERS,
    startDate: initialMonth.startDate,
    endDate: initialMonth.endDate,
  }));

  const tableQuery = useStatement(queryFilters);

  const chartFilters = useMemo(
    () => ({
      startDate: queryFilters.startDate,
      endDate: queryFilters.endDate,
      productType: queryFilters.productType,
      page: 1,
      limit: 1000,
    }),
    [queryFilters.startDate, queryFilters.endDate, queryFilters.productType],
  );

  const chartQuery = useStatement(chartFilters);

  const tableTransactions = useMemo(
    () => tableQuery.data?.transactions ?? [],
    [tableQuery.data?.transactions],
  );
  const filteredTableTransactions = useMemo(
    () => filterTransactionsByProduct(tableTransactions, productView),
    [tableTransactions, productView],
  );

  const chartTransactions = useMemo(
    () => chartQuery.data?.transactions ?? [],
    [chartQuery.data?.transactions],
  );
  const filteredChartTransactions = useMemo(
    () => filterTransactionsByProduct(chartTransactions, productView),
    [chartTransactions, productView],
  );

  const chartTotals = useMemo(
    () => calculateTotals(filteredChartTransactions),
    [filteredChartTransactions],
  );

  const expenseSeries = useMemo(
    () => buildDailyExpenseSeries(filteredChartTransactions),
    [filteredChartTransactions],
  );
  const incomeSeries = useMemo(
    () => buildDailyIncomeSeries(filteredChartTransactions),
    [filteredChartTransactions],
  );

  const currency = chartQuery.data?.currency ?? tableQuery.data?.currency ?? 'BRL';
  const totalCount = tableQuery.data?.totalCount ?? tableTransactions.length ?? 0;
  const requestedPage = queryFilters.page ?? DEFAULT_STATEMENT_FILTERS.page ?? 1;
  const requestedLimit = queryFilters.limit ?? DEFAULT_STATEMENT_FILTERS.limit ?? 10;
  const serverPage = tableQuery.data?.page ?? requestedPage;
  const serverLimit = tableQuery.data?.limit ?? requestedLimit;
  const currentPage = (tableQuery.isFetching ? requestedPage : serverPage) - 1;
  const rowsPerPage = tableQuery.isFetching ? requestedLimit : serverLimit;

  const handleProductViewChange = (view: ProductView) => {
    setProductView(view);
    setQueryFilters((previous) => ({
      ...previous,
      productType: view === 'all' ? undefined : view,
      page: 1,
    }));
  };

  const handleMonthChange = (monthKey: string) => {
    setSelectedMonthKey(monthKey);
    const option = MONTH_FILTERS.find((item) => item.key === monthKey) ?? initialMonth;
    setQueryFilters((previous) => ({
      ...previous,
      startDate: option.startDate,
      endDate: option.endDate,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryFilters((previous) => ({
      ...previous,
      page: page + 1,
    }));
  };

  const handleRowsPerPageChange = (limit: number) => {
    setQueryFilters((previous) => ({
      ...previous,
      limit,
      page: 1,
    }));
  };

  if (tableQuery.isLoading && !tableQuery.data) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  const hasError = tableQuery.isError && !tableQuery.data;
  const chartLoading = chartQuery.isLoading && !chartQuery.data;
  const chartFetching = chartQuery.isFetching;

  return (
    <StatementTemplate
      header={<StatementHeader title="Extrato" />}
      filters={null}
      insights={
        hasError ? (
          <Alert severity="error">
            Não foi possível carregar o extrato. Tente novamente mais tarde.
          </Alert>
        ) : (
          <StatementLineChart
            incomeSeries={incomeSeries}
            expenseSeries={expenseSeries}
            currency={currency}
            loading={chartLoading || chartFetching}
            totalIncome={chartTotals.income}
            totalExpense={chartTotals.expense}
            monthOptions={MONTH_SELECTOR_OPTIONS}
            selectedMonth={selectedMonthKey}
            onMonthChange={handleMonthChange}
            productFilterOptions={PRODUCT_FILTER_OPTIONS}
            selectedProduct={productView}
            onProductFilterChange={handleProductViewChange}
          />
        )
      }
      transactions={
        <TransactionsTable
          transactions={hasError ? [] : filteredTableTransactions}
          currency={currency}
          loading={tableQuery.isFetching}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          totalCount={hasError ? 0 : totalCount}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          error={hasError}
        />
      }
    />
  );
}
