import type { ProductType } from '../types/statement';
import type { IconName } from '../components/atoms/Icon';

export const PRODUCT_ICON_NAME: Record<ProductType, IconName> = {
  business_account: 'business-account',
  expense_management: 'expense-management',
  suppliers: 'suppliers',
};

export const DEFAULT_ICON_COLOR = 'rgba(0,0,0,0.56)';
export const SELECTED_ICON_COLOR = '#3D0079';
