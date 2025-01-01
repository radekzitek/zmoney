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
import { counterpartyStyles } from '../styles/counterparties';

function Counterparties() {
  const [counterparties, setCounterparties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    (cp.reference && cp.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cp.description && cp.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <Box sx={commonStyles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h4" gutterBottom>
        Counterparties
      </Typography>
      
      {error && (
        <Alert severity="error" sx={counterpartyStyles.errorAlert}>
          {error}
        </Alert>
      )}

      <Paper sx={commonStyles.searchContainer}>
        <Box sx={commonStyles.searchBox}>
          <SearchIcon sx={commonStyles.searchIcon} />
          <TextField 
            label="Search Counterparties" 
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
                <TableCell>Reference</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell sx={counterpartyStyles.actionCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCounterparties
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cp) => (
                  <TableRow key={cp.id}>
                    <TableCell>{cp.name}</TableCell>
                    <TableCell>{cp.reference}</TableCell>
                    <TableCell>{cp.description}</TableCell>
                    <TableCell>{formatDate(cp.created_at)}</TableCell>
                    <TableCell>{formatDate(cp.updated_at)}</TableCell>
                    <TableCell sx={counterpartyStyles.actionCell}>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredCounterparties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={commonStyles.tableEmptyCell}>
                    {searchTerm ? "No counterparties found matching your search" : "No counterparties yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCounterparties.length}
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

export default Counterparties; 