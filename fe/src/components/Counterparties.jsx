import { 
  Box, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Fab,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon 
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { logger } from '../services/logger';

function Counterparties() {
  const [counterparties, setCounterparties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCounterparties();
  }, []);

  const fetchCounterparties = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/counterparties`);
      if (!response.ok) throw new Error('Failed to fetch counterparties');
      
      const data = await response.json();
      setCounterparties(data);
      logger.info('Counterparties fetched successfully', { count: data.length });
    } catch (error) {
      setError('Failed to fetch counterparties');
      logger.error('Error fetching counterparties', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredCounterparties = counterparties.filter(cp => 
    cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cp.reference && cp.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Counterparties
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField 
            label="Search Counterparties" 
            variant="standard" 
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <List>
          {filteredCounterparties.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No counterparties found" 
                secondary={searchTerm ? "Try adjusting your search" : "Add some counterparties to get started"}
              />
            </ListItem>
          ) : (
            filteredCounterparties.map((cp) => (
              <ListItem key={cp.id}>
                <ListItemText
                  primary={cp.name}
                  secondary={cp.reference}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      <Fab 
        color="primary" 
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Counterparties; 