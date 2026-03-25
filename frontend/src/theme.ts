'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
      light: '#1ed760',
      dark: '#1aa34a',
      contrastText: '#000000',
    },
    secondary: {
      main: '#b3b3b3',
      light: '#ffffff',
      dark: '#6a6a6a',
    },
    background: {
      default: '#121212',
      paper: '#181818',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#6a6a6a',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    error: {
      main: '#ff6b7a',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: 'hidden',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.3)',
          },
        },
        '*': { boxSizing: 'border-box' },
        a: { color: 'inherit', textDecoration: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          textTransform: 'none',
          fontWeight: 700,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1ed760',
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            backgroundColor: '#2a2a2a',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1DB954',
              boxShadow: '0 0 0 2px rgba(29, 185, 84, 0.1)',
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          height: 4,
          '&:hover': {
            color: '#1DB954',
            '& .MuiSlider-thumb': {
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 12,
          height: 12,
          opacity: 0,
          transition: 'opacity 0.15s ease',
          '&:hover, &.Mui-active': {
            boxShadow: 'none',
          },
        },
        track: {
          border: 'none',
        },
        rail: {
          opacity: 0.2,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
        },
        primary: {
          '&:hover': {
            backgroundColor: '#1ed760',
            transform: 'scale(1.06)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 36,
          borderRadius: 100,
          minWidth: 'auto',
          padding: '6px 16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          padding: '8px 16px',
        },
        head: {
          fontSize: 11,
          fontWeight: 500,
          color: '#6a6a6a',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          },
        },
      },
    },
  },
});

export default theme;
