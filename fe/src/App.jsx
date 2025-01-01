import { useEffect, useMemo, useState } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { logger } from './services/logger';
import Layout from './components/Layout';
import About from './components/About';
import Reports from './components/Reports';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import Counterparties from './components/Counterparties';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976d2' },
          secondary: { main: '#dc004e' }
        },
        typography: {
          h4: {
            fontSize: '1.2rem',
            fontWeight: 500
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 500
          },
          body1: { fontSize: '0.8rem' },
          body2: { fontSize: '0.75rem' },
          button: {
            fontSize: '0.8rem',
            textTransform: 'none'
          }
        },
        components: {
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '4px 8px',
                fontSize: '0.8rem'
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
                minHeight: '48px',
                '@media (min-width: 600px)': {
                  minHeight: '48px'
                }
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                padding: '4px 8px',
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
                padding: '4px',
                size: 'small'
              }
            }
          }
        }
      }),
    [mode],
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    logger.info('Theme changed', { newTheme: mode === 'light' ? 'dark' : 'light' });
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout toggleTheme={toggleTheme} mode={mode}>
          <Routes>
            <Route path="/" element={<Reports />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/counterparties" element={<Counterparties />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
