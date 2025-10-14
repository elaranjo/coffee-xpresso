import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { forwardRef } from 'react';

import arrowTrendDownSvg from '../../assets/icons/arrow-trend-down.svg?raw';
import arrowTrendUpSvg from '../../assets/icons/arrow-trend-up.svg?raw';
import businessAccountSvg from '../../assets/icons/business-account.svg?raw';
import checkmarkLineSvg from '../../assets/icons/checkmark-line.svg?raw';
import chevronDownSvg from '../../assets/icons/chevron-down.svg?raw';
import expenseManagementSvg from '../../assets/icons/expense-management.svg?raw';
import suppliersSvg from '../../assets/icons/suppliers.svg?raw';

const ICONS = {
  'arrow-trend-down': arrowTrendDownSvg,
  'arrow-trend-up': arrowTrendUpSvg,
  'business-account': businessAccountSvg,
  'checkmark-line': checkmarkLineSvg,
  'chevron-down': chevronDownSvg,
  'expense-management': expenseManagementSvg,
  suppliers: suppliersSvg,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  name: IconName;
  size?: number | string;
  color?: string;
  sx?: SxProps<Theme>;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { name, size = 20, color = 'currentColor', sx, className, style, ...rest },
  ref,
) {
  const svgMarkup = ICONS[name];

  if (!svgMarkup) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Icon] Unknown icon "${name}".`);
    }
    return null;
  }

  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <Box
      component="span"
      className={className}
      ref={ref}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        color,
        '& svg': {
          display: 'block',
          width: '100%',
          height: '100%',
        },
        ...sx,
      }}
      style={style}
      {...rest}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
});
