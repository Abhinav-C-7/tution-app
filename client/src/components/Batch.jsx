import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ClassIcon from '@mui/icons-material/Class';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const Batch = ({ batch }) => {
    const navigate = useNavigate();
    console.log(batch);
    return (
        <Card sx={{ height: '100%', gap: 2, display: 'flex', flexDirection: 'column', position: 'relative', maxWidth: '300px', minWidth: '300px' }}>
            <CardContent>
                {/* Batch Name & Icon */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1, color: 'white' }}>
                        <ClassIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                        {batch.name}
                    </Typography>
                </Stack>

                {/* Details Section */}
                <Stack spacing={1.5}>


                    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                        <GroupsIcon fontSize="small" />
                        <Typography variant="body2">{batch._count?.students} Students</Typography>
                    </Stack>
                </Stack>

                {/* Status Chip (Top Right) */}
                {/*  <Chip
                    label={batch.status}
                    color={batch.status === 'Full' ? 'error' : 'success'}
                    size="small"
                    sx={{ position: 'absolute', top: 1, right: 16 }}
                />*/}
            </CardContent>

            {/* Bottom Actions */}
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push buttons to bottom */}
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={() => navigate(`/batch/${batch.id}`)} size="small" variant="outlined" fullWidth>
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
};

export default Batch;
