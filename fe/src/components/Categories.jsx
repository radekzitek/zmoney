import { 
  Box, 
  Paper, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Fab,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon 
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { logger } from '../services/logger';
import { commonStyles } from '../styles/common';
import { categoryStyles } from '../styles/categories';
import CategoryDialog from './CategoryDialog';
import ConfirmDialog from './ConfirmDialog';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data);
      logger.info('Categories fetched successfully', { count: data.length });
    } catch (error) {
      setError('Failed to fetch categories');
      logger.error('Error fetching categories', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setConfirmDialogOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      const url = selectedCategory
        ? `${import.meta.env.VITE_API_URL}/categories/${selectedCategory.id}`
        : `${import.meta.env.VITE_API_URL}/categories`;
      
      const response = await fetch(url, {
        method: selectedCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save category');
      
      await fetchCategories();
      setDialogOpen(false);
      showNotification(
        `Category ${selectedCategory ? 'updated' : 'created'} successfully`,
        'success'
      );
    } catch (error) {
      logger.error('Error saving category:', { error: error.message });
      showNotification('Failed to save category', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${selectedCategory.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete category');
      
      await fetchCategories();
      setConfirmDialogOpen(false);
      showNotification('Category deleted successfully', 'success');
    } catch (error) {
      logger.error('Error deleting category:', { error: error.message });
      showNotification('Failed to delete category', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <Box sx={categoryStyles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      
      {error && (
        <Alert severity="error" sx={categoryStyles.errorAlert}>
          {error}
        </Alert>
      )}

      <Paper sx={commonStyles.searchContainer}>
        <Box sx={commonStyles.searchBox}>
          <SearchIcon sx={commonStyles.searchIcon} />
          <TextField 
            label="Search Categories" 
            variant="standard" 
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Paper>

      <Paper sx={commonStyles.tableContainer}>
        <TableContainer>
          <Table sx={commonStyles.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell sx={categoryStyles.actionCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{formatDate(category.created_at)}</TableCell>
                    <TableCell>{formatDate(category.updated_at)}</TableCell>
                    <TableCell sx={categoryStyles.actionCell}>
                      <IconButton size="small" onClick={() => handleEdit(category)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(category)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={commonStyles.tableEmptyCell}>
                    {searchTerm ? "No categories found matching your search" : "No categories yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Fab 
        color="primary" 
        aria-label="add"
        onClick={handleAdd}
        sx={commonStyles.actionButton}
      >
        <AddIcon />
      </Fab>

      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete ${selectedCategory?.name}?`}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default Categories; 