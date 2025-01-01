import { AppBar, Toolbar, Button, Box, IconButton, Tooltip } from '@mui/material';
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
import { navbarStyles } from '../styles/navbar';

function Navbar({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <AccountBalanceIcon sx={navbarStyles.logo} />
        <Box sx={navbarStyles.menuSection}>
          <Button 
            color="inherit" 
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/')}
            sx={navbarStyles.menuButton(isActive('/'))}
          >
            Reports
          </Button>
          
          <Button 
            color="inherit"
            startIcon={<TransactionsIcon />}
            onClick={() => navigate('/transactions')}
            sx={navbarStyles.menuButton(isActive('/transactions'))}
          >
            Transactions
          </Button>
          <Button 
            color="inherit"
            startIcon={<CategoryIcon />}
            onClick={() => navigate('/categories')}
            sx={navbarStyles.menuButton(isActive('/categories'))}
          >
            Categories
          </Button>
          <Button 
            color="inherit"
            startIcon={<CounterpartiesIcon />}
            onClick={() => navigate('/counterparties')}
            sx={navbarStyles.menuButton(isActive('/counterparties'))}
          >
            Counterparties
          </Button>
          <Button 
            color="inherit"
            startIcon={<InfoIcon />}
            onClick={() => navigate('/about')}
            sx={navbarStyles.menuButton(isActive('/about'))}
          >
            About
          </Button>
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={navbarStyles.themeButton}
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