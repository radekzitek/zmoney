import { Box } from '@mui/material';
import Navbar from './Navbar';
import { layoutStyles } from '../styles/layout';

function Layout({ children, toggleTheme, mode }) {
  return (
    <>
      <Box sx={layoutStyles.navbarContainer}>
        <Navbar toggleTheme={toggleTheme} mode={mode} />
      </Box>
      <Box sx={layoutStyles.contentContainer}>
        <Box sx={layoutStyles.centeredContent}>
          {children}
        </Box>
      </Box>
    </>
  );
}

export default Layout; 