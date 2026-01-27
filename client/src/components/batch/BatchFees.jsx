import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams, useOutletContext } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, IconButton, Divider, Stack, Chip,
    TextField, InputAdornment, List, ListItem, ListItemText, FormControl, Select, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCardIcon from '@mui/icons-material/AddCard';
import InfoIcon from '@mui/icons-material/Info';
import BatchFeeRequest from './BatchFeeRequest';
import api from '../../api/axios';
import BatchTable from './BatchTable';

const BatchFees = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { searchQuery } = useOutletContext() || { searchQuery: "" };
    const [loading, setLoading] = useState(true);

    // Data State
    const [batch, setBatch] = useState(null);
    const [feeRequests, setFeeRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // UI State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentData, setPaymentData] = useState({
        studentId: '', amount: '', date: new Date().toISOString().split('T')[0], remarks: '',
        feeRequestId: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const batchRes = await api.get(`/batches/${id}`);
            const requestsRes = await api.get(`/feerequests/batch/${id}`);

            setBatch(batchRes.data);
            setFeeRequests(requestsRes.data);

            if (requestsRes.data.length > 0) {
                // Default to the most recent request
                setSelectedRequest(requestsRes.data[0]);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAddPayment = async () => {
        try {
            // Basic validation
            if (!paymentData.studentId || !paymentData.amount) {
                alert("Please select a student and enter an amount");
                return;
            }

            // The current payment controller might not be using feeRequestId yet, but let's send it.
            await api.post('/payments', {
                ...paymentData,
                batchId: id,
                feeRequestId: selectedRequest?.id
            });
            setPaymentDialogOpen(false);
            setPaymentData({ ...paymentData, studentId: '', amount: '', remarks: '' });
            fetchData();
        } catch (error) {
            console.error("Error adding payment:", error);
            alert("Failed to add payment");
        }
    };

    // Calculate stats for the *selected* request
    const getRequestStats = (req) => {
        if (!req) return { expected: 0, collected: 0, pending: 0 };
        const total = req.amount * req.studentFees.length;
        const paid = req.studentFees.reduce((sum, sf) => sum + sf.amountPaid, 0);
        return {
            expected: total,
            collected: paid,
            pending: total - paid
        };
    };

    const stats = getRequestStats(selectedRequest);

    // Filter students for table
    const tableData = selectedRequest?.studentFees?.map(sf => ({
        id: sf.student.id,
        name: sf.student.name,
        feeStatus: sf.status, // 'Pending', 'Paid', 'Partial'
        expected: selectedRequest.amount,
        paid: sf.amountPaid,
        pending: selectedRequest.amount - sf.amountPaid,
        studentFeeId: sf.id
    })).filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase())) || [];


    const columns = [
        { id: 'name', label: 'Name', minWidth: 150 },
        { id: 'feeStatus', label: 'Status', minWidth: 100, align: 'center' },
        { id: 'expected', label: 'Fee Amount', minWidth: 100, format: (v) => `₹${v.toLocaleString()}` },
        { id: 'paid', label: 'Paid', minWidth: 100, format: (v) => `₹${v.toLocaleString()}` },
        { id: 'pending', label: 'Pending', minWidth: 100, format: (v) => `₹${v.toLocaleString()}`, style: { color: 'error.main', fontWeight: 'bold' } },
    ];

    if (loading) return <Box display="flex" justifyContent="center" height="80vh" alignItems="center"><CircularProgress /></Box>;
    if (!batch) return <Typography m={4}>Batch not found</Typography>;

    // Case 1: No Fee Requests created yet -> Show Setup
    if (feeRequests.length === 0) {
        return (
            <Box>
                <Typography variant="h5" fontWeight="bold" mb={2}>Fee Management</Typography>
                <BatchFeeRequest onSuccess={fetchData} />
            </Box>
        );
    }

    // Case 2: Show Dashboard
    return (
        <Box>
            {/* Header with Fee Request Dropdown */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5" fontWeight="bold">Fee Overview</Typography>

                    {/* Fee Request Dropdown */}
                    {feeRequests.length > 0 && (
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                                value={selectedRequest?.id || ''}
                                onChange={(e) => {
                                    const req = feeRequests.find(r => r.id === e.target.value);
                                    if (req) setSelectedRequest(req);
                                }}
                                displayEmpty
                                sx={{ bgcolor: 'white' }}
                            >
                                {feeRequests.map((req) => (
                                    <MenuItem key={req.id} value={req.id}>
                                        {req.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>

                <Stack direction="row" spacing={2}>
                    {/* Create New Request Button */}
                    <Button
                        variant="outlined"
                        startIcon={<AddCardIcon />}
                        onClick={() => navigate(`/batches/${id}/fees/new`)}
                    >
                        New Request
                    </Button>
                </Stack>
            </Box>

            {selectedRequest && (
                <Box mb={3} display="flex" gap={3}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Created:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Deadline:</strong> {new Date(selectedRequest.dueDate).toLocaleDateString()}
                    </Typography>
                </Box>
            )}


            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2, color: 'primary.main' }}><AttachMoneyIcon fontSize="large" /></Box>
                        <Box>
                            <Typography color="textSecondary" variant="body2" fontWeight="bold">Total Expected</Typography>
                            <Typography variant="h5" fontWeight="bold">₹{stats.expected.toLocaleString()}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2, color: 'success.main' }}><CheckCircleIcon fontSize="large" /></Box>
                        <Box>
                            <Typography color="textSecondary" variant="body2" fontWeight="bold">Collected</Typography>
                            <Typography variant="h5" fontWeight="bold">₹{stats.collected.toLocaleString()}</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2, color: 'warning.main' }}><WarningIcon fontSize="large" /></Box>
                        <Box>
                            <Typography color="textSecondary" variant="body2" fontWeight="bold">Pending</Typography>
                            <Typography variant="h5" fontWeight="bold">₹{stats.pending.toLocaleString()}</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Student Table */}
            <BatchTable
                students={tableData}
                columns={[...columns, {
                    id: 'action',
                    label: 'Action',
                    minWidth: 150,
                    align: 'center',
                    format: (value, row) => (
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddCardIcon />}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                setPaymentData({
                                    ...paymentData,
                                    studentId: row.id,
                                    amount: '',
                                    remarks: '',
                                    maxAmount: row.pending // Store max amount for validation
                                });
                                setPaymentDialogOpen(true);
                            }}
                            disabled={row.pending <= 0}
                        >
                            Add Payment
                        </Button>
                    )
                }]}
                onRowClick={(student) => {
                    // Find the full student object from nested data if needed, or just select
                    // For now, let's just log or set simple state
                    console.log("Clicked", student);
                }}
            />

            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Payment</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Student"
                            value={selectedRequest?.studentFees?.find(sf => sf.student.id === parseInt(paymentData.studentId))?.student.name || ''}
                            fullWidth
                            disabled
                        />
                        <TextField
                            label={`Amount (Max: ₹${paymentData.maxAmount})`}
                            type="number"
                            fullWidth
                            value={paymentData.amount}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val > paymentData.maxAmount) return; // Prevent input > max
                                setPaymentData({ ...paymentData, amount: e.target.value });
                            }}
                            error={parseInt(paymentData.amount) > paymentData.maxAmount}
                            helperText={parseInt(paymentData.amount) > paymentData.maxAmount ? `Cannot exceed ₹${paymentData.maxAmount}` : ''}
                        />
                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            value={paymentData.date}
                            onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Remarks"
                            fullWidth
                            value={paymentData.remarks}
                            onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddPayment}
                        variant="contained"
                        disabled={!paymentData.amount || parseInt(paymentData.amount) > paymentData.maxAmount}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default BatchFees;