import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import AddIcon from '@mui/icons-material/Add';
import Batch from '../components/batch/Batch';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BatchPage = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        console.log('BatchPage: Attempting to fetch batches...'); // <-- ADD THIS
        const response = await api.get('/batches');
        setBatches(response.data);
      } catch (err) {
        console.log(batches)
        console.error("Error fetching batches:", err);
        setError("Failed to load batches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (

    <Box>


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

      <Grid container spacing={3}>
        {batches.map((batch) => (
          <Grid item xs={12} sm={6} md={4} key={batch.id}>
            <Batch batch={batch} />
          </Grid>
        ))}

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