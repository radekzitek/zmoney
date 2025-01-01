import { 
  AppBar, 
  Toolbar, 
  Button,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Receipt as TransactionsIcon,
  Category as CategoryIcon,
  People as CounterpartiesIcon,
  Info as InfoIcon,
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <AccountBalanceIcon sx={{ mr: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
            }}
          >
            Reports
          </Button>
          
          <Button 
            color="inherit"
            startIcon={<TransactionsIcon />}
            onClick={() => navigate('/transactions')}
            sx={{ 
              backgroundColor: isActive('/transactions') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
            }}
          >
            Transactions
          </Button>
          <Button 
            color="inherit"
            startIcon={<CategoryIcon />}
            onClick={() => navigate('/categories')}
            sx={{ 
              backgroundColor: isActive('/categories') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
            }}
          >
            Categories
          </Button>
          <Button 
            color="inherit"
            startIcon={<CounterpartiesIcon />}
            onClick={() => navigate('/counterparties')}
            sx={{ 
              backgroundColor: isActive('/counterparties') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
            }}
          >
            Counterparties
          </Button>
          <Button 
            color="inherit"
            startIcon={<InfoIcon />}
            onClick={() => navigate('/about')}
            sx={{ 
              backgroundColor: isActive('/about') ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
            }}
          >
            About
          </Button>
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={{ ml: 1 }}
            >
              {mode === 'light' ? <MoonIcon /> : <SunIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 