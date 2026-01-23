import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
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

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const BatchFees = () => {
    const { id } = useParams();
    const { searchQuery } = useOutletContext() || { searchQuery: "" };
    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentPayments, setStudentPayments] = useState([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

    // Discount Edit State
    const [isEditingDiscount, setIsEditingDiscount] = useState(false);
    const [newDiscountValue, setNewDiscountValue] = useState('');

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
            setBatch(batchRes.data);
            setStudents(batchRes.data.students || []);
            setPayments(paymentsRes.data);

            // If a student is selected, refresh their data in the modal too
            if (selectedStudent) {
                const updatedStudent = (batchRes.data.students || []).find(s => s.id === selectedStudent.id);
                if (updatedStudent) setSelectedStudent(updatedStudent);
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
            await api.put(`/students/${studentId}`, { discount: parseInt(newDiscount) || 0 });
            // Optimistic update or refresh
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, discount: parseInt(newDiscount) || 0 } : s));

            // Also update selected student to reflect change immediately
            if (selectedStudent && selectedStudent.id === studentId) {
                setSelectedStudent(prev => ({ ...prev, discount: parseInt(newDiscount) || 0 }));
            }

            setIsEditingDiscount(false);
            fetchData(); // Ensure consistency
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
        setIsEditingDiscount(false); // Reset edit mode
        setNewDiscountValue(student.discount || 0);

        // Filter payments for this student locally since we have all payments
        const sPayments = payments.filter(p => p.studentId === student.id);
        setStudentPayments(sPayments);
    };

    // --- Derived Data for UI ---
    // Recalculate everything for display
    const processedStudents = students
        .filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(s => {
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
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Discount Applied</Typography>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {isEditingDiscount ? (
                                                <>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={newDiscountValue}
                                                        onChange={(e) => setNewDiscountValue(e.target.value)}
                                                        sx={{ width: 100 }}
                                                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                                    />
                                                    <IconButton size="small" color="primary" onClick={() => handleUpdateDiscount(selectedStudent.id, newDiscountValue)}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => {
                                                        setIsEditingDiscount(false);
                                                        setNewDiscountValue(selectedStudent.discount);
                                                    }}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="h6" color="success.main">- ₹{selectedStudent.discount}</Typography>
                                                    <IconButton size="small" onClick={() => {
                                                        setIsEditingDiscount(true);
                                                        setNewDiscountValue(selectedStudent.discount);
                                                    }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </Stack>
                                    </Grid>
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