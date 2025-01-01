import { createTheme } from '@mui/material';

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    h4: {
      fontSize: '0.8rem',
      fontWeight: 500
    },
    h6: {
      fontSize: '0.8rem',
      fontWeight: 500
    },
    body1: { fontSize: '0.6rem' },
    body2: { fontSize: '0.6rem' },
    button: {
      fontSize: '0.6rem',
      textTransform: 'none'
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '2px 4px',
          fontSize: '0.6rem'
        },
        head: {
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: '2px',
          paddingBottom: '2px'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        regular: {
          minHeight: '36px',
          '@media (min-width: 800px)': {
            minHeight: '36px'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '2px 8px',
          minWidth: '64px'
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          width: '40px',
          height: '40px',
          minHeight: '40px'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '2px',
          size: 'small'
        }
      }
    }
  }
}); 