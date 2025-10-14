import { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { PropsWithChildren } from 'react';
import { espressoTheme } from '../theme';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={espressoTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
      <ReactQueryDevtools
        buttonPosition="bottom-right"
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}
