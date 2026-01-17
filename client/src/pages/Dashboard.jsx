

import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatCard from '../components/StatCard';
import { useEffect, useState } from 'react';
import api from "../api/axios";
import CircularProgress from '@mui/material/CircularProgress';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBatches: 0,
    pendingFees: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  }
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Batches"
            value={stats.totalBatches}
            icon={<ClassIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            icon={<AttachMoneyIcon />}
            color="warning"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
