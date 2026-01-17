import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Icons
import AddIcon from '@mui/icons-material/Add';
import Batch from '../components/Batch';
import { useNavigate } from 'react-router-dom';

// API
import api from '../api/axios'; // 👈 Import your axios bridge

const BatchPage = () => {
  const navigate = useNavigate();

  // 1. Define State for Real Data
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch Data on Component Mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await api.get('/batches');
        setBatches(response.data); // ✅ Update state with real DB data
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Failed to load batches. Please try again.");
      } finally {
        setLoading(false); // ✅ Stop loading whether it worked or failed
      }
    };

    fetchBatches();
  }, []);

  // 3. Handle Loading State
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  // 4. Handle Error State
  if (error) {
    return (
      <Box mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header & Add Button */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Batches
        </Typography>
        <Button
          onClick={() => navigate('../batches/create')}
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ width: { xs: '300px', sm: 'auto' } }}
        >
          Create New Batch
        </Button>
      </Stack>

      {/* The Grid Layout */}
      <Grid container spacing={3}>
        {/* ✅ Map over the STATE 'batches', not the mock data */}
        {batches.map((batch) => (
          <Grid item xs={12} sm={6} md={4} key={batch.id}>
            <Batch batch={batch} />
          </Grid>
        ))}

        {/* Show a friendly message if there are 0 batches */}
        {!loading && batches.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, ml: 3 }}>
            No batches found. Create one to get started!
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default BatchPage;