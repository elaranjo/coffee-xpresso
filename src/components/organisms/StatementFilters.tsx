import { Stack } from '@mui/material';

import type { ProductType, ProductView } from '../../types/statement';
import { Icon } from '../atoms/Icon';
import { DEFAULT_ICON_COLOR, PRODUCT_ICON_NAME, SELECTED_ICON_COLOR } from '../../constants/icons';
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
        const iconColor = selected ? SELECTED_ICON_COLOR : DEFAULT_ICON_COLOR;
        const icon = option === 'all'
          ? (
              <Icon name="checkmark-line" size={20} color={iconColor} aria-hidden />
            )
          : (
              <Icon name={PRODUCT_ICON_NAME[option]} size={20} color={iconColor} aria-hidden />
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
