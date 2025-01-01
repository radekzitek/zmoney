import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  Divider 
} from '@mui/material';
import { useEffect, useState } from 'react';
import { logger } from '../services/logger';
import { aboutStyles } from '../styles/about';

function About() {
  const [systemInfo, setSystemInfo] = useState({
    backend: {
      version: 'Loading...',
      status: 'Loading...'
    }
  });

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/system-info`);
        const data = await response.json();
        setSystemInfo(data);
        logger.info('System info fetched successfully');
      } catch (error) {
        logger.error('Failed to fetch system info', { error: error.message });
        setSystemInfo({
          backend: {
            version: 'Error loading',
            status: 'Unavailable'
          }
        });
      }
    };

    fetchSystemInfo();
  }, []);

  return (
    <Box sx={aboutStyles.container}>
      <Paper elevation={3} sx={aboutStyles.paper}>
        <Typography variant="h4" gutterBottom>
          System Information
        </Typography>
        <Divider sx={aboutStyles.divider} />
        
        <List>
          <ListItem>
            <ListItemText 
              primary="Frontend Version" 
              secondary={import.meta.env.PACKAGE_VERSION || '1.0.0'} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Backend Version" 
              secondary={systemInfo.backend.version} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Backend Status" 
              secondary={systemInfo.backend.status} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Environment" 
              secondary={import.meta.env.MODE} 
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default About; 