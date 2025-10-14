import { Box } from '@mui/material';

interface TrendIconProps {
  direction: 'up' | 'down';
  color?: string;
  size?: number;
}

export function TrendIcon({ direction, color = '#2196F3', size = 20 }: TrendIconProps) {
  const rotation = direction === 'up' ? '0deg' : '180deg';

  return (
    <Box
      component="span"
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${rotation})` }}
      >
        <path
          d="M12 4L6 10H10V20H14V10H18L12 4Z"
          fill="currentColor"
        />
      </svg>
    </Box>
  );
}
