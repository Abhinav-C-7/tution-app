import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import api from '../../api/axios';
import BatchTable from './BatchTable';

const BatchFees = () => {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const response = await api.get(`/batches/${id}`);
                setBatch(response.data);
            } catch (error) {
                console.error("Error fetching batch:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatch();
    }, [id]);

    if (loading) {
        return <CircularProgress sx={{ mt: 4, ml: 4 }} />;
    }

    if (!batch) {
        return <Typography sx={{ m: 4 }}>Batch not found</Typography>;
    }

    // --- Statistics Calculation ---
    const totalStudents = batch.students?.length || 0;
    const batchFee = batch.fee || 0;

    const paidStudents = batch.students?.filter(s => s.feeStatus === 'Paid') || [];
    const pendingStudents = batch.students?.filter(s => s.feeStatus === 'Pending' || !s.feeStatus) || [];
    // Assuming 'Overdue' might be a status in future or if explicitly set
    const overdueStudents = batch.students?.filter(s => s.feeStatus === 'Overdue') || [];

    const totalExpected = totalStudents * batchFee;
    const collectedAmount = paidStudents.length * batchFee;
    const pendingAmount = totalExpected - collectedAmount;

    // --- Helper Components ---
    const StatCard = ({ title, value, subtext, icon, color }) => (
        <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
            <Box sx={{ mr: 2, color: color }}>
                {icon}
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                    {value}
                </Typography>
                {subtext && <Typography variant="caption" color="textSecondary">{subtext}</Typography>}
            </Box>
        </Card>
    );

    return (
        <Box sx={{ p: 0 }}> {/* Padding handled by parent container usually, or adjust as needed */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Fee Overview: {batch.name}
            </Typography>

            {/* Statistics Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Expected"
                        value={`₹${totalExpected.toLocaleString()}`}
                        subtext={`${totalStudents} Students @ ₹${batchFee}`}
                        icon={<AttachMoneyIcon fontSize="large" />}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="collected"
                        value={`₹${collectedAmount.toLocaleString()}`}
                        subtext={`${paidStudents.length} Paid`}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending"
                        value={`₹${pendingAmount.toLocaleString()}`}
                        subtext={`${pendingStudents.length + overdueStudents.length} Pending`}
                        icon={<WarningIcon fontSize="large" />}
                        color="warning.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Collection Rate"
                        value={`${totalStudents > 0 ? Math.round((paidStudents.length / totalStudents) * 100) : 0}%`}
                        subtext="of total fees"
                        icon={<PeopleIcon fontSize="large" />}
                        color="info.main"
                    />
                </Grid>
            </Grid>

            {/* Student List Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Student Fee Status
            </Typography>
            <BatchTable
                students={batch.students}
                onRowClick={(student) => setSelectedStudent(student)}
            />

            {/* Student Detail Modal */}
            <Dialog
                open={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Student Fee Details
                    <IconButton
                        aria-label="close"
                        onClick={() => setSelectedStudent(null)}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedStudent && (
                        <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">{selectedStudent.name}</Typography>
                                <Chip
                                    label={selectedStudent.feeStatus || 'Pending'}
                                    color={selectedStudent.feeStatus === 'Paid' ? 'success' : 'warning'}
                                />
                            </Box>

                            <Divider />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                                    <Typography variant="body1">{selectedStudent.phone || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Parent Name</Typography>
                                    <Typography variant="body1">{selectedStudent.parentName || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Batch Fee</Typography>
                                    <Typography variant="body1">₹{batchFee}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Current Status</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {selectedStudent.feeStatus || 'Pending'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Transaction History
                                </Typography>
                                <Typography variant="body2" color="textSecondary" fontStyle="italic">
                                    No transaction records found.
                                    (Partial payments and history tracking are coming soon)
                                </Typography>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BatchFees;