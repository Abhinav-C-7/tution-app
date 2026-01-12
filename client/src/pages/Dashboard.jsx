

import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatCard from '../components/StatCard';
import { students, batches } from '../services/mockData';

const Dashboard = () => {
  // Calculate stats
  const totalStudents = students.length;
  const totalBatches = batches.length;
  const pendingFees = students.filter(s => s.fee_status === 'Pending').length;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Batches"
            value={totalBatches}
            icon={<ClassIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Fees"
            value={pendingFees}
            icon={<AttachMoneyIcon />}
            color="warning"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
