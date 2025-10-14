import { Stack } from '@mui/material';

import type { ProductType, ProductView } from '../../types/statement';
import { CheckmarkLineIcon } from '../atoms/icons/CheckmarkLineIcon';
import { ProductIcon } from '../atoms/icons/ProductIcon';
import { FilterChip } from '../molecules/FilterChip';

interface StatementFiltersProps {
  productView: ProductView;
  onProductViewChange: (view: ProductView) => void;
}

const PRODUCT_LABEL: Record<ProductType, string> = {
  business_account: 'Conta empresarial',
  expense_management: 'Gestão de despesas',
  suppliers: 'Fornecedores',
};

const PRODUCT_ORDER: ProductView[] = ['all', 'business_account', 'expense_management', 'suppliers'];

export function StatementFilters({ productView, onProductViewChange }: StatementFiltersProps) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      {PRODUCT_ORDER.map((option) => {
        const label = option === 'all' ? 'Visão geral' : PRODUCT_LABEL[option];
        const selected = productView === option;
        const icon =
          option === 'all' ? (
            <CheckmarkLineIcon selected={selected} />
          ) : (
            <ProductIcon type={option} selected={selected} size={20} />
          );

        return (
          <FilterChip
            key={option}
            icon={icon}
            label={label}
            selected={selected}
            onClick={() => onProductViewChange(option)}
          />
        );
      })}
    </Stack>
  );
}
