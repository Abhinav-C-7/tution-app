import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, IconButton, Divider, Stack, Chip,
    TextField, MenuItem, Select, InputLabel, FormControl, List, ListItem,
    ListItemText, InputAdornment, TableBody, TableCell, TableRow, TableHead, Table
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCardIcon from '@mui/icons-material/AddCard';
import SettingsIcon from '@mui/icons-material/Settings';
import PercentIcon from '@mui/icons-material/Percent';

import api from '../../api/axios';
import BatchTable from './BatchTable';

const BatchFees = () => {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentPayments, setStudentPayments] = useState([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [discountDialogOpen, setDiscountDialogOpen] = useState(false);

    // Forms State
    const [paymentData, setPaymentData] = useState({
        studentId: '', amount: '', date: new Date().toISOString().split('T')[0], remarks: ''
    });

    const [feeSetupData, setFeeSetupData] = useState({
        billingCycle: 'MONTHLY',
        customDuration: 6,
        fee: '',
        admissionFee: 0
    });

    // --- Data Fetching ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const batchRes = await api.get(`/batches/${id}`);
            const paymentsRes = await api.get(`/payments/batch/${id}`);

            // We need students with their latest data (including discount)
            // batchRes usually includes students if using getBatchDetails from controller
            // Check if batchRes.data.students exists, otherwise might need separate call
            setBatch(batchRes.data);
            setStudents(batchRes.data.students || []);
            setPayments(paymentsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // --- Calculation Logic ---
    const calculateExpectedFee = (student) => {
        if (!batch || !batch.fee) return 0;

        const fee = batch.fee || 0;
        const admission = batch.admissionFee || 0;
        const discount = student.discount || 0;
        const cycle = batch.billingCycle || 'ONE_TIME';

        let multiplier = 1;
        const joined = new Date(student.joinedAt);
        const now = new Date();

        // Calculate months difference roughly
        // (This can be refined based on exact business logic)
        const monthsDiff = (now.getFullYear() - joined.getFullYear()) * 12 + (now.getMonth() - joined.getMonth()) + 1;

        if (cycle === 'MONTHLY') {
            multiplier = Math.max(1, monthsDiff);
        } else if (cycle === 'QUARTERLY') {
            multiplier = Math.max(1, Math.ceil(monthsDiff / 3));
        } else if (cycle === 'CUSTOM' && batch.customDuration) {
            multiplier = Math.max(1, Math.ceil(monthsDiff / batch.customDuration));
        }

        return (fee * multiplier) + admission - discount;
    };

    const getStudentFinancials = (student) => {
        const expected = calculateExpectedFee(student);
        const paid = payments
            .filter(p => p.studentId === student.id)
            .reduce((sum, p) => sum + p.amount, 0);
        const pending = expected - paid;

        let status = 'Pending';
        if (pending <= 0) status = 'Paid';
        else if (paid > 0) status = 'Partial';

        return { expected, paid, pending, status };
    };

    // --- Actions ---
    const handleFeeSetupSubmit = async () => {
        try {
            await api.put(`/batches/${id}`, {
                ...feeSetupData,
                fee: parseInt(feeSetupData.fee),
                admissionFee: parseInt(feeSetupData.admissionFee),
                customDuration: feeSetupData.billingCycle === 'CUSTOM' ? parseInt(feeSetupData.customDuration) : null
            });
            fetchData();
        } catch (error) {
            console.error("Setup failed", error);
            alert("Failed to save fee structure");
        }
    };

    const handleUpdateDiscount = async (studentId, newDiscount) => {
        try {
            await api.put(`/students/${studentId}`, { discount: newDiscount });
            // Optimistic update or refresh
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, discount: parseInt(newDiscount) } : s));
        } catch (error) {
            console.error("Discount update failed", error);
        }
    };

    const handleAddPayment = async () => {
        try {
            await api.post('/payments', {
                ...paymentData,
                batchId: id
            });
            setPaymentDialogOpen(false);
            setPaymentData({ ...paymentData, studentId: '', amount: '', remarks: '' });
            fetchData();
        } catch (error) {
            console.error("Error adding payment:", error);
        }
    };

    const handleStudentRowClick = async (student) => {
        setSelectedStudent(student);
        // Filter payments for this student locally since we have all payments
        const sPayments = payments.filter(p => p.studentId === student.id);
        setStudentPayments(sPayments);
    };

    // --- Derived Data for UI ---
    // Recalculate everything for display
    const processedStudents = students.map(s => {
        const fin = getStudentFinancials(s);
        return { ...s, ...fin, feeStatus: fin.status }; // Override feeStatus for display
    });

    const totalExpectedBatch = processedStudents.reduce((sum, s) => sum + s.expected, 0);
    const totalCollected = processedStudents.reduce((sum, s) => sum + s.paid, 0);
    const totalPending = totalExpectedBatch - totalCollected;
    const paidCount = processedStudents.filter(s => s.status === 'Paid').length;
    const pendingCount = processedStudents.filter(s => s.status === 'Pending').length;

    // Custom Columns for BatchTable
    const columns = [
        { id: 'name', label: 'Name', minWidth: 150 },
        { id: 'feeStatus', label: 'Status', minWidth: 100, align: 'center' },
        { id: 'expected', label: 'Total Fee', minWidth: 100, format: (v) => `₹${v.toLocaleString()}` },
        { id: 'discount', label: 'Discount', minWidth: 80, format: (v) => v ? `₹${v}` : '-' },
        { id: 'paid', label: 'Paid', minWidth: 100, format: (v) => `₹${v.toLocaleString()}` },
        { id: 'pending', label: 'Pending', minWidth: 100, format: (v) => `₹${v.toLocaleString()}`, style: { color: 'error.main', fontWeight: 'bold' } },
    ];


    // --- Render ---
    if (loading) return <Box display="flex" justifyContent="center" height="80vh" alignItems="center"><CircularProgress /></Box>;
    if (!batch) return <Typography m={4}>Batch not found</Typography>;

    // 1. Fee Setup Mode
    if (!batch.fee || batch.fee === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Card sx={{ p: 4, width: '100%', maxWidth: 600 }}>
                    <Typography variant="h5" gutterBottom mb={3} fontWeight="bold">Setup Fee Structure</Typography>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel>Billing Cycle</InputLabel>
                            <Select
                                value={feeSetupData.billingCycle}
                                label="Billing Cycle"
                                onChange={(e) => setFeeSetupData({ ...feeSetupData, billingCycle: e.target.value })}
                            >
                                <MenuItem value="MONTHLY">Monthly</MenuItem>
                                <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                                <MenuItem value="ONE_TIME">One Time</MenuItem>
                                <MenuItem value="CUSTOM">Custom (Every X Months)</MenuItem>
                            </Select>
                        </FormControl>

                        {feeSetupData.billingCycle === 'CUSTOM' && (
                            <TextField
                                label="Billing Duration (Months)"
                                type="number"
                                value={feeSetupData.customDuration}
                                onChange={(e) => setFeeSetupData({ ...feeSetupData, customDuration: e.target.value })}
                            />
                        )}

                        <TextField
                            label="Total Fee Amount (Per Cycle)"
                            type="number"
                            value={feeSetupData.fee}
                            onChange={(e) => setFeeSetupData({ ...feeSetupData, fee: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        />

                        <TextField
                            label="Admission Fee (One Time)"
                            type="number"
                            value={feeSetupData.admissionFee}
                            onChange={(e) => setFeeSetupData({ ...feeSetupData, admissionFee: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                            helperText="Optional"
                        />

                        <Button variant="contained" size="large" onClick={handleFeeSetupSubmit}>
                            Save Fee Structure
                        </Button>
                    </Stack>
                </Card>
            </Box>
        );
    }

    // 2. Dashboard Mode
    const StatCard = ({ title, value, subtext, icon, color }) => (
        <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
            <Box sx={{ mr: 2, color: color }}>{icon}</Box>
            <Box>
                <Typography color="textSecondary" variant="body2" fontWeight="bold">{title}</Typography>
                <Typography variant="h5" fontWeight="bold">{value}</Typography>
                {subtext && <Typography variant="caption" color="textSecondary">{subtext}</Typography>}
            </Box>
        </Card>
    );

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Fee Overview: {batch.name}</Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<PercentIcon />} onClick={() => setDiscountDialogOpen(true)}>
                        Manage Discounts
                    </Button>
                    <Button variant="contained" startIcon={<AddCardIcon />} onClick={() => setPaymentDialogOpen(true)}>
                        Add Payment
                    </Button>
                </Stack>
            </Box>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Expected"
                        value={`₹${totalExpectedBatch.toLocaleString()}`}
                        subtext="Includes Admission & Cycles"
                        icon={<AttachMoneyIcon fontSize="large" />}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Collected"
                        value={`₹${totalCollected.toLocaleString()}`}
                        subtext={`${paidCount} Paid, ${pendingCount} Pending`}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending"
                        value={`₹${totalPending.toLocaleString()}`}
                        subtext="To be collected"
                        icon={<WarningIcon fontSize="large" />}
                        color="warning.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Billing Cycle"
                        value={batch.billingCycle}
                        subtext={`Fee: ₹${batch.fee}`}
                        icon={<SettingsIcon fontSize="large" />}
                        color="info.main"
                    />
                </Grid>
            </Grid>

            {/* Student Table */}
            <Typography variant="h6" sx={{ mb: 2 }}>Student Fee Details</Typography>
            <BatchTable
                students={processedStudents}
                columns={columns}
                onRowClick={handleStudentRowClick}
            />

            {/* -- Dialogs -- */}

            {/* Discount Dialog */}
            <Dialog
                open={discountDialogOpen}
                onClose={() => setDiscountDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Manage Student Discounts</DialogTitle>
                <DialogContent dividers>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Current Discount</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            defaultValue={student.discount}
                                            onBlur={(e) => handleUpdateDiscount(student.id, e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                            sx={{ width: 120 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="caption" color="textSecondary">Auto-saves on blur</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDiscountDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Payment</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Student</InputLabel>
                            <Select
                                value={paymentData.studentId}
                                label="Student"
                                onChange={(e) => setPaymentData({ ...paymentData, studentId: e.target.value })}
                            >
                                {students.map((student) => (
                                    <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Amount (₹)"
                            type="number"
                            fullWidth
                            value={paymentData.amount}
                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
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
                    <Button onClick={handleAddPayment} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Student Details with Transaction History */}
            <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {selectedStudent?.name} - details
                    <IconButton onClick={() => setSelectedStudent(null)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedStudent && (() => {
                        const fin = getStudentFinancials(selectedStudent);
                        return (
                            <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography>Status: <Chip label={fin.status} color={fin.status === 'Paid' ? 'success' : 'warning'} size="small" /></Typography>
                                    <Typography>Joined: {new Date(selectedStudent.joinedAt).toLocaleDateString()}</Typography>
                                </Box>
                                <Divider />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><Typography variant="subtitle2">Total Expected</Typography><Typography variant="h6">₹{fin.expected}</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="subtitle2">Discount Applied</Typography><Typography variant="h6" color="success.main">- ₹{selectedStudent.discount}</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="subtitle2">Total Paid</Typography><Typography variant="h6" color="primary.main">₹{fin.paid}</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="subtitle2">Pending</Typography><Typography variant="h6" color="error.main">₹{fin.pending}</Typography></Grid>
                                </Grid>
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" gutterBottom>History</Typography>
                                    <List dense>
                                        {studentPayments.map((p) => (
                                            <ListItem key={p.id} divider>
                                                <ListItemText primary={`₹${p.amount} - ${p.remarks}`} secondary={new Date(p.date).toLocaleDateString()} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Stack>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BatchFees;