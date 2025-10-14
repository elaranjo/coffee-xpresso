import { createTheme } from '@mui/material/styles';

export const espressoTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5C3BFE',
      light: '#F0EBF5',
      dark: '#3D0079',
    },
    secondary: {
      main: '#FF6F4B',
    },
    success: {
      main: '#3A7AFE',
    },
    error: {
      main: '#FF6F4B',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
    },
    divider: 'rgba(0,0,0,0.12)',
  },
  typography: {
    fontFamily:
      "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 400, fontSize: '24px', lineHeight: 1.34 },
    h6: { fontWeight: 500, fontSize: '20px', lineHeight: 1.6 },
    subtitle1: { fontWeight: 400, fontSize: '16px', lineHeight: 1.5 },
    body1: { fontSize: '16px', lineHeight: 1.5 },
    body2: { fontSize: '14px', lineHeight: 1.43 },
    caption: { fontSize: '12px', lineHeight: 1.66 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontWeight: 400,
          fontSize: '10px',
          letterSpacing: '0.16px',
          lineHeight: '18px',
          height: 42,
          padding: '12px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,0,0,0.12)',
          padding: '16px',
        },
        head: {
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '24px',
        },
      },
    },
  },
});
