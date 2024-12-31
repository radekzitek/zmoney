import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <AccountBalanceIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Financial Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            startIcon={<AssessmentIcon />}
          >
            Transactions
          </Button>
          <Button 
            color="inherit"
            startIcon={<SettingsIcon />}
          >
            Settings
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 