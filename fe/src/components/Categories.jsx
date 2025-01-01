import { 
  Box, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Fab
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useEffect } from 'react';
import { logger } from '../services/logger';

function Categories() {
  useEffect(() => {
    logger.info('Categories component mounted');
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <List>
          {/* Add category items here */}
          <ListItem>
            <ListItemText
              primary="Groceries"
              secondary="Food and household items"
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

export default Categories; 