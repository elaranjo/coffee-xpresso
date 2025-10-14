import { Box, Typography } from '@mui/material';

import { TrendIcon } from '../atoms/icons/TrendIcon';

interface SummaryMetricProps {
  value: string;
  direction: 'up' | 'down';
  color: string;
}

export function SummaryMetric({ value, direction, color }: SummaryMetricProps) {
  return (
    <Box display="flex" alignItems="center" gap={0.75}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TrendIcon direction={direction} color={color} size={18} />
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Lato, sans-serif',
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.17px',
          color: 'rgba(0, 0, 0, 0.6)',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
