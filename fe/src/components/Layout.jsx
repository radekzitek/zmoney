import { Box } from '@mui/material';
import Navbar from './Navbar';

function Layout({ children, toggleTheme, mode }) {
  return (
    <>
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'primary.main'  // Keep navbar background full width
      }}>
        <Box sx={{ 
          maxWidth: '1200px', 
          mx: 'auto'           // Center the navbar content
        }}>
          <Navbar toggleTheme={toggleTheme} mode={mode} />
        </Box>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        maxWidth: '1200px',
        mx: 'auto',
        px: 2,
        mt: 2,
        mb: 2
      }}>
        {children}
      </Box>
    </>
  );
}

export default Layout; 