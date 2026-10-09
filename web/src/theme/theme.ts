'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ECC067',
      dark: '#D4A74E',
      light: '#F5D78E',
      contrastText: '#2C1810',
    },
    secondary: {
      main: '#8C5E3C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FDFBF7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810',
      secondary: '#6E5D53',
    },
  },
  typography: {
    fontFamily: 'inherit',
    h1: {
      fontWeight: 700,
      color: '#2C1810',
    },
    h2: {
      fontWeight: 700,
      color: '#2C1810',
    },
    h3: {
      fontWeight: 600,
      color: '#2C1810',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: 'none',
          padding: '8px 20px',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(236, 192, 103, 0.3)',
          },
        },
        contained: {
          color: '#2C1810',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid #F0E8D9',
          boxShadow: '0 4px 20px rgba(44, 24, 16, 0.04)',
        },
      },
    },
  },
});
