import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { SelectChevronIcon } from '../atoms/icons/SelectChevronIcon';

interface MonthOption {
  key: string;
  label: string;
}

interface MonthSelectorProps {
  options: MonthOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MonthSelector({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Selecionar período',
}: MonthSelectorProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <Select
      size="small"
      value={value}
      onChange={handleChange}
      displayEmpty
      disabled={disabled}
      IconComponent={SelectChevronIcon}
      sx={{
        minWidth: 180,
        bgcolor: '#FFFFFF',
        borderRadius: 100,
        border: '1px solid #BDBDBD',
        height: 32,
        px: 1.5,
        '.MuiSelect-select': {
          py: 0,
          pl: 1,
          pr: 4,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Lato, sans-serif',
          fontSize: 10,
          fontWeight: 400,
          lineHeight: '18px',
          letterSpacing: '0.16px',
          color: 'rgba(0,0,0,0.87)',
          textTransform: 'capitalize',
        },
        '.MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSvgIcon-root': {
          color: '#3D0079',
        },
      }}
      renderValue={(selected) => {
        if (!selected) {
          return placeholder;
        }
        const option = options.find((item) => item.key === selected);
        return option?.label ?? selected;
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.key}
          value={option.key}
          sx={{
            textTransform: 'capitalize',
            fontFamily: 'Lato, sans-serif',
            fontSize: 12,
            lineHeight: '16px',
            color: 'rgba(0,0,0,0.87)',
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
