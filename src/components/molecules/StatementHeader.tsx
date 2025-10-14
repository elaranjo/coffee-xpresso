import { Box, Typography } from '@mui/material';

interface StatementHeaderProps {
  title: string;
  subtitle?: string;
}

export function StatementHeader({ title, subtitle }: StatementHeaderProps) {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'Lato, sans-serif',
          fontWeight: 400,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Lato, sans-serif',
            color: 'text.secondary',
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
