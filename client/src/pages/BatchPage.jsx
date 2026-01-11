import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Icons
import AddIcon from '@mui/icons-material/Add';
import Batch from '../components/Batch';

// 1. Dummy Data (Replace this with API data later)
const batches = [
  { id: 1, name: 'Class 10 - Science', days: 'Mon, Wed, Fri', time: '4:00 PM', students: 24, status: 'Active' },
  { id: 2, name: 'Class 12 - Math', days: 'Tue, Thu, Sat', time: '6:00 PM', students: 18, status: 'Active' },
  { id: 3, name: 'JEE Mains Batch', days: 'Daily', time: '5:00 PM', students: 45, status: 'Active' },
  { id: 4, name: 'NEET Droppers', days: 'Daily', time: '10:00 AM', students: 30, status: 'Full' },
  { id: 5, name: 'Class 9 - English', days: 'Mon, Thu', time: '3:00 PM', students: 12, status: 'Active' },
];

const BatchPage = () => {
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
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
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