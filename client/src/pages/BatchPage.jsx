import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Icons
import AddIcon from '@mui/icons-material/Add';
import Batch from '../components/Batch';

import { batches } from '../services/mockData';

import { useNavigate } from 'react-router-dom';


const BatchPage = () => {
  const navigate = useNavigate();
  return (
    <Box>
      {/* 2. Page Header & Add Button */}
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
        <Button onClick={() => navigate('../batches/create')}
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ width: { xs: '300px', sm: 'auto' } }}
        >
          Create New Batch
        </Button>
      </Stack>

      {/* 3. The Grid Layout */}
      <Grid container spacing={3}>
        {batches.map((batch) => (

          // 4. Grid Item: xs=12 (Mobile), md=4 (Laptop -> 3 cards per row)
          <Grid item xs={12} sm={6} md={4} key={batch.id}>
            <Batch batch={batch} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BatchPage;