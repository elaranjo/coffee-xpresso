import Box from '@mui/material/Box';

import businessAccountSvg from '../../../assets/icons/business-account.svg?raw';
import expenseManagementSvg from '../../../assets/icons/expense-management.svg?raw';
import suppliersSvg from '../../../assets/icons/suppliers.svg?raw';
import type { ProductType } from '../../../types/statement';

interface ProductIconProps {
  type: ProductType;
  size?: number;
  selected?: boolean;
}

const SVG_MAP: Record<ProductType, string> = {
  business_account: businessAccountSvg,
  expense_management: expenseManagementSvg,
  suppliers: suppliersSvg,
};

export function ProductIcon({ type, size = 20, selected = false }: ProductIconProps) {
  const svgMarkup = SVG_MAP[type];
  const color = selected ? '#3D0079' : 'rgba(0,0,0,0.56)';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        width: size,
        height: size,
        color,
        '& svg': {
          width: '100%',
          height: '100%',
          display: 'block',
        },
      }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
