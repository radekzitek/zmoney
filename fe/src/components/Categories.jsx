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
import { commonStyles } from '../styles/common';
import { categoryStyles } from '../styles/categories';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
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
        sx={commonStyles.actionButton}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Categories; 