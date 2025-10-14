import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

import type { DailySeriesPoint, ProductView } from '../../types/statement';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { MonthSelector } from '../molecules/MonthSelector';
import { SummaryMetric } from '../molecules/SummaryMetric';
import { FilterChip } from '../molecules/FilterChip';

interface StatementLineChartProps {
  incomeSeries: DailySeriesPoint[];
  expenseSeries: DailySeriesPoint[];
  currency?: string;
  loading?: boolean;
  totalIncome: number;
  totalExpense: number;
  title?: string;
  monthOptions: { key: string; label: string }[];
  selectedMonth: string;
  onMonthChange: (monthKey: string) => void;
  productFilterOptions?: { value: ProductView; label: string; icon: (selected: boolean) => ReactElement }[];
  selectedProduct?: ProductView;
  onProductFilterChange?: (value: ProductView) => void;
}

const incomeColor = '#2196F3';
const expenseColor = '#FF6F4B';
const neutralText = 'rgba(0, 0, 0, 0.65)';

export function StatementLineChart({
  incomeSeries,
  expenseSeries,
  currency = 'BRL',
  loading = false,
  totalIncome,
  totalExpense,
  title = 'Resumo de movimentações',
  monthOptions,
  selectedMonth,
  onMonthChange,
  productFilterOptions,
  selectedProduct,
  onProductFilterChange,
}: StatementLineChartProps) {
  const { points, ticks } = useMemo(() => {
    const map = new Map<number, { timestamp: number; income: number; expense: number }>();

    incomeSeries.forEach((point) => {
      const timestamp = new Date(point.date).getTime();
      const entry = map.get(timestamp) ?? { timestamp, income: 0, expense: 0 };
      entry.income += point.value;
      map.set(timestamp, entry);
    });

    expenseSeries.forEach((point) => {
      const timestamp = new Date(point.date).getTime();
      const entry = map.get(timestamp) ?? { timestamp, income: 0, expense: 0 };
      entry.expense += point.value;
      map.set(timestamp, entry);
    });

    const points = Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);

    if (points.length === 0) {
      return { points, ticks: [] as number[] };
    }

    const dayInMs = 24 * 60 * 60 * 1000;
    const first = points[0].timestamp;
    const last = points[points.length - 1].timestamp;
    const ticks: number[] = [];
    const start = new Date(first);
    start.setDate(start.getDate() - start.getDay());
    for (let ts = start.getTime(); ts <= last; ts += 7 * dayInMs) {
      ticks.push(ts);
    }
    if (ticks[ticks.length - 1] !== last) {
      ticks.push(last);
    }

    return { points, ticks };
  }, [incomeSeries, expenseSeries]);

  const tickSet = useMemo(() => new Set(ticks), [ticks]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 1,
        backgroundColor: '#FFFFFF',
        boxShadow:
          '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.2)',
        gap: 0,
        minHeight: 261,
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1.5}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Lato, sans-serif',
              fontWeight: 500,
              fontSize: 20,
              lineHeight: '32px',
              letterSpacing: '0.15px',
              color: 'rgba(0, 0, 0, 0.87)',
            }}
          >
            {title}
          </Typography>
          <MonthSelector
            options={monthOptions}
            value={selectedMonth}
            onChange={onMonthChange}
            disabled={monthOptions.length === 0}
          />
        </Stack>

        {productFilterOptions && productFilterOptions.length > 0 ? (
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            {productFilterOptions.map((option) => {
              const selected = selectedProduct === option.value;
              return (
                <FilterChip
                  key={option.value}
                  icon={option.icon(selected)}
                  label={option.label}
                  selected={selected}
                  onClick={() => onProductFilterChange?.(option.value)}
                />
              );
            })}
          </Stack>
        ) : null}

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <SummaryMetric
            direction="up"
            color={incomeColor}
            value={formatCurrency(totalIncome, currency)}
          />
          <SummaryMetric
            direction="down"
            color={expenseColor}
            value={formatCurrency(totalExpense, currency)}
          />
        </Stack>

        {loading ? (
          <Box
            minHeight={149}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress sx={{ color: '#5C3BFE' }} />
          </Box>
        ) : points.length === 0 ? (
          <Box
            minHeight={149}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Sem dados para exibir
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuste os filtros para visualizar o histórico do período.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: 149,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              pt: 1,
              pb: 1,
              pl: 1,
              pr: 0,
            }}
          >
            <LineChart
              height={133}
              margin={{ top: 12, right: 16, bottom: 32, left: 0 }}
              dataset={points}
              xAxis={[
                {
                  dataKey: 'timestamp',
                  scaleType: 'time',
                  valueFormatter: (value: number | string | Date) => {
                    const date = typeof value === 'number' ? new Date(value) : new Date(String(value));
                    return formatDate(date, "D 'de' MMM");
                  },
                  tickSize: 0,
                  tickLabelStyle: {
                    fill: neutralText,
                    fontSize: 12,
                    fontFamily: 'Lato, sans-serif',
                  },
                  tickInterval: (value: number | string | Date) => {
                    const ts = typeof value === 'number' ? value : new Date(value).getTime();
                    return tickSet.has(ts);
                  },
                },
              ]}
              yAxis={[
                {
                  tickSize: 0,
                  valueFormatter: () => '',
                },
              ]}
              grid={{ horizontal: false, vertical: false }}
              series={[
                {
                  id: 'income',
                  label: 'Entradas',
                  dataKey: 'income',
                  color: incomeColor,
                  curve: 'monotoneX',
                  showMark: false,
                },
                {
                  id: 'expense',
                  label: 'Saídas',
                  dataKey: 'expense',
                  color: expenseColor,
                  curve: 'monotoneX',
                  showMark: false,
                },
              ]}
              sx={{
                '.MuiChartsLegend-root': {
                  display: 'none',
                },
                '.MuiChartsAxis-root .MuiChartsAxis-line': {
                  stroke: 'transparent',
                },
                '.MuiChartsAxis-root .MuiChartsAxis-tick': {
                  stroke: 'transparent',
                },
                '.MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
                  transform: 'translateY(6px)',
                },
                '.MuiLineElement-root': {
                  strokeWidth: 1.8,
                },
                '.MuiChartsAxis-root text': {
                  fill: neutralText,
                  fontSize: 12,
                  fontFamily: 'Lato, sans-serif',
                },
              }}
            />
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
