import { useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { logger } from './services/logger';
import { createAppTheme } from './styles/theme';

// Component imports
import Layout from './components/Layout';
import About from './components/About';
import Reports from './components/Reports';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import Counterparties from './components/Counterparties';

/**
 * Main application component
 * Handles theme management and routing
 */
function App() {
  const [mode, setMode] = useState('light');

  // Create theme based on current mode
  const theme = useMemo(
    () => createAppTheme(mode),
    [mode]
  );

  // Theme toggle handler
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      logger.info('Theme changed', { newTheme: newMode });
      return newMode;
    });
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
