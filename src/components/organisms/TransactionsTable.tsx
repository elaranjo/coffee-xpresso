import {
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

import type { ProductType, Transaction } from '../../types/statement';
import { formatCurrency, getSignedAmount } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { ProductIcon } from '../atoms/icons/ProductIcon';

interface TransactionsTableProps {
  transactions: Transaction[];
  currency?: string;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  loading?: boolean;
  error?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const PRODUCT_LABELS: Record<ProductType, string> = {
  business_account: 'Conta empresarial',
  expense_management: 'Gestão de despesas',
  suppliers: 'Fornecedores',
};

function getDirectionLabel(direction: Transaction['direction']) {
  return direction === 'credit' ? 'Recebido' : 'Enviado';
}

export function TransactionsTable({
  transactions,
  currency = 'BRL',
  page,
  rowsPerPage,
  totalCount,
  loading = false,
  error = false,
  onPageChange,
  onRowsPerPageChange,
}: TransactionsTableProps) {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const creditColor = '#2196F3';
  const debitColor = '#D32F2F';
  const rowsPerPageOptions = useMemo(() => {
    const base = [10, 20, 50, 100];
    return base.includes(rowsPerPage) ? base : [...base, rowsPerPage].sort((a, b) => a - b);
  }, [rowsPerPage]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        boxShadow:
          '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}
    >
      <TableContainer>
        <Table
          size="medium"
          sx={{
            '& td, & th': { borderBottomColor: 'rgba(0,0,0,0.12)' },
            '& tbody tr': { height: 72 },
            '& thead tr': { height: 56 },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  fontFamily: 'Lato, sans-serif',
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.87)',
                  fontSize: 14,
                  lineHeight: '24px',
                  letterSpacing: '0.017em',
                },
              }}
            >
              <TableCell>Data</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Valor R$</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Produto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box py={4} display="flex" justifyContent="center">
                    <CircularProgress size={24} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box py={4} textAlign="center">
                    <Typography color="error">
                      Não foi possível carregar os dados. Tente novamente.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box py={4} textAlign="center">
                    <Typography color="text.secondary">
                      Nenhuma movimentação encontrada para o filtro selecionado.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => {
                const signedAmount = getSignedAmount(transaction);
                const isCredit = transaction.direction === 'credit';
                const productType = transaction.productType ?? null;
                return (
                  <TableRow key={transaction.id} hover sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                    <TableCell width={180}>
                      <Stack spacing={0}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'Lato, sans-serif',
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: '20px',
                            letterSpacing: '0.17px',
                            color: 'rgba(0,0,0,0.87)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDate(transaction.date, 'DD/MM/YYYY [às] HH:mm:ss')}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: 'Lato, sans-serif',
                            fontWeight: 400,
                            fontSize: 16,
                            lineHeight: '24px',
                            letterSpacing: '0.15px',
                            color: 'rgba(0,0,0,0.87)',
                          }}
                        >
                          {transaction.description}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" width={160}>
                      <Stack spacing={0.25} alignItems="flex-end">
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'Lato, sans-serif',
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: '20px',
                            letterSpacing: '0.17px',
                            color: isCredit ? creditColor : debitColor,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {formatCurrency(Math.abs(signedAmount), currency)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'Lato, sans-serif',
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: '20px',
                            letterSpacing: '0.17px',
                            color: 'rgba(0,0,0,0.6)',
                          }}
                        >
                          {getDirectionLabel(transaction.direction)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell width={180}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'Lato, sans-serif',
                          fontWeight: 400,
                          fontSize: 16,
                          lineHeight: '24px',
                          letterSpacing: '0.15px',
                          color: 'rgba(0,0,0,0.87)',
                        }}
                      >
                        {transaction.responsible ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell width={200}>
                      {productType ? (
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'transparent',
                              color: 'rgba(0,0,0,0.56)',
                            }}
                          >
                            <ProductIcon type={productType} size={20} />
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'Lato, sans-serif',
                              fontWeight: 400,
                              fontSize: 14,
                              lineHeight: '20px',
                              letterSpacing: '0.17px',
                              color: 'rgba(0,0,0,0.87)',
                            }}
                          >
                            {transaction.productName ?? PRODUCT_LABELS[productType]}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'Lato, sans-serif',
                            fontWeight: 400,
                            fontSize: 14,
                            lineHeight: '20px',
                            letterSpacing: '0.17px',
                            color: 'rgba(0,0,0,0.6)',
                          }}
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={rowsPerPageOptions}
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Linhas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid #ECECF2',
          px: 2,
          py: 1.5,
          '.MuiTablePagination-toolbar': { px: 0 },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontFamily: 'Lato, sans-serif',
            fontSize: 12,
            color: '#6F6F7A',
            letterSpacing: '0.01em',
          },
          '.MuiTablePagination-select': {
            fontFamily: 'Lato, sans-serif',
            fontSize: 12,
            lineHeight: '20px',
            letterSpacing: '0.4px',
            color: 'rgba(0,0,0,0.87)',
          },
          '.MuiTablePagination-actions .MuiIconButton-root': {
            padding: 1,
            borderRadius: '100px',
          },
        }}
      />
    </Paper>
  );
}
