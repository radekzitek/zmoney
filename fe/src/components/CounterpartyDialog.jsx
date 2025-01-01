import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import { useState, useEffect } from 'react';
import { logger } from '../services/logger';
import { counterpartyDialogStyles } from '../styles/counterparties';

function CounterpartyDialog({ open, onClose, onSave, counterparty = null }) {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (counterparty) {
      setFormData({
        name: counterparty.name || '',
        reference: counterparty.reference || '',
        description: counterparty.description || ''
      });
    } else {
      setFormData({
        name: '',
        reference: '',
        description: ''
      });
    }
    setErrors({});
  }, [counterparty, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      logger.info('Counterparty form submitted', { 
        id: counterparty?.id,
        name: formData.name 
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {counterparty ? 'Edit Counterparty' : 'Add Counterparty'}
      </DialogTitle>
      <DialogContent>
        <Box sx={counterpartyDialogStyles.form}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            label="Reference"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {counterparty ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CounterpartyDialog; 