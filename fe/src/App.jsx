import { useEffect } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button
} from '@mui/material';
import { logger } from './services/logger';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  useEffect(() => {
    logger.info('App component mounted', { component: 'App' });
  }, []);

  const testLogging = () => {
    logger.info('Info message from frontend');
    logger.warn('Warning message from frontend');
    logger.error('Error message from frontend', { 
      additionalInfo: 'This is a test error'
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Financial Transactions
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2 
          }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to the Application
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={testLogging}
            >
              Test Logging
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
