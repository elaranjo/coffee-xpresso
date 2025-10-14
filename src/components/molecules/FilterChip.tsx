import { Chip } from '@mui/material';
import type { ReactElement } from 'react';

interface FilterChipProps {
  icon?: ReactElement;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export function FilterChip({ icon, label, selected = false, onClick }: FilterChipProps) {
  return (
    <Chip
      icon={icon}
      label={label}
      clickable
      onClick={onClick}
      sx={{
        borderRadius: 100,
        px: 1.5,
        height: 42,
        border: selected ? 'none' : '1px solid #BDBDBD',
        bgcolor: selected ? '#F0EBF5' : '#FFFFFF',
        color: 'rgba(0,0,0,0.87)',
        fontFamily: 'Lato, sans-serif',
        '& .MuiChip-icon': {
          ml: 0.5,
        },
        '&:hover': {
          bgcolor: selected ? '#E4DBEC' : '#F7F7FA',
        },
        transition: 'background-color 0.2s ease',
      }}
    />
  );
}
