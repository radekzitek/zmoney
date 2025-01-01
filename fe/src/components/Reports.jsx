import { 
  Box, 
  Paper, 
  Typography,
  Grid
} from '@mui/material';
import { useEffect } from 'react';
import { logger } from '../services/logger';

function Reports() {
  useEffect(() => {
    logger.info('Reports component mounted');
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Financial Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Overview
            </Typography>
            {/* Add charts/reports here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            {/* Add category chart here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports; 