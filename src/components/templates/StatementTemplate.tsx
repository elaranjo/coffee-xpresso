import {
  AppBar,
  Box,
  Container,
  Divider,
  Stack,
  Toolbar,
} from '@mui/material';
import espressoLogoUrl from '../../assets/images/espresso-logo.svg';

interface StatementTemplateProps {
  header: React.ReactNode;
  filters: React.ReactNode;
  insights: React.ReactNode;
  transactions: React.ReactNode;
}

export function StatementTemplate({ header, filters, insights, transactions }: StatementTemplateProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(0deg, rgba(61, 0, 121, 0.02), rgba(61, 0, 121, 0.02)), #FFFFFF',
      }}
    >
      <AppBar
        position="static"
        elevation={4}
        sx={{
          backgroundColor: '#E4DBEC',
          color: 'text.primary',
          boxShadow: '0px 1px 10px rgba(0,0,0,0.12), 0px 4px 5px rgba(0,0,0,0.14), 0px 2px 4px -1px rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 3, gap: 2 }}>
          <Box
            component="img"
            src={espressoLogoUrl}
            alt="Espresso"
            width={150}
            height={32}
            sx={{ display: 'block' }}
          />
        </Toolbar>
      </AppBar>
      <Divider sx={{ borderColor: 'rgba(0,0,0,0.12)' }} />
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: 1620,
          px: { xs: 3, lg: 6 },
          py: { xs: 5, md: 6 },
          mx: 'auto',
        }}
      >
        <Stack spacing={3}>
          {header}
          {filters}
          {insights}
          {transactions}
        </Stack>
      </Container>
    </Box>
  );
}
