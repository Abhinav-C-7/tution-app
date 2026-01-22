import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Divider,
    Stack,
    Chip,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCardIcon from '@mui/icons-material/AddCard';

import api from '../../api/axios';
import BatchTable from './BatchTable';

const BatchFees = () => {
    const { id } = useParams();
    const [batch, setBatch] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentPayments, setStudentPayments] = useState([]); // Payments for the selected student

    // Add Payment State
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentData, setPaymentData] = useState({
        studentId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const batchRes = await api.get(`/batches/${id}`);
            const paymentsRes = await api.get(`/payments/batch/${id}`);

            setBatch(batchRes.data);
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

    const handleStudentClick = async (student) => {
        setSelectedStudent(student);
        try {
            const res = await api.get(`/payments/student/${student.id}`);
            setStudentPayments(res.data);
        } catch (error) {
            console.error("Error fetching student payments", error);
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
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error adding payment:", error);
        }
    };

    if (loading) {
        return <CircularProgress sx={{ mt: 4, ml: 4 }} />;
    }

    if (!batch) {
        return <Typography sx={{ m: 4 }}>Batch not found</Typography>;
    }

    // --- Statistics Calculation ---
    const totalStudents = batch.students?.length || 0;
    const batchFee = batch.fee || 0;
    const totalExpected = totalStudents * batchFee;

    // Calculate real collected amount from payments table
    const collectedAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = totalExpected - collectedAmount;

    // Determine counts based on status (which is updated in DB by backend)
    const paidStudentsCount = batch.students?.filter(s => s.feeStatus === 'Paid').length || 0;
    const partialStudentsCount = batch.students?.filter(s => s.feeStatus === 'Partial').length || 0;
    const pendingStudentsCount = batch.students?.filter(s => s.feeStatus === 'Pending' || !s.feeStatus).length || 0;

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
        <Box sx={{ p: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    Fee Overview: {batch.name}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCardIcon />}
                    onClick={() => setPaymentDialogOpen(true)}
                >
                    Add Payment
                </Button>
            </Box>

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
                        title="Collected"
                        value={`₹${collectedAmount.toLocaleString()}`}
                        subtext={`${paidStudentsCount} Paid, ${partialStudentsCount} Partial`}
                        icon={<CheckCircleIcon fontSize="large" />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending"
                        value={`₹${pendingAmount.toLocaleString()}`}
                        subtext={`${pendingStudentsCount} Pending`}
                        icon={<WarningIcon fontSize="large" />}
                        color="warning.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Collection Rate"
                        value={`${totalExpected > 0 ? Math.round((collectedAmount / totalExpected) * 100) : 0}%`}
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
                onRowClick={handleStudentClick}
            />

            {/* Add Payment Dialog */}
            <Dialog
                open={paymentDialogOpen}
                onClose={() => setPaymentDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
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
                                {batch.students?.map((student) => (
                                    <MenuItem key={student.id} value={student.id}>
                                        {student.name}
                                    </MenuItem>
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
                            placeholder="e.g. Cash, UPI"
                            fullWidth
                            value={paymentData.remarks}
                            onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddPayment} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

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
                                    <Typography variant="subtitle2" color="textSecondary">Batch Fee</Typography>
                                    <Typography variant="body1">₹{batchFee}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Total Paid</Typography>
                                    <Typography variant="body1" color="success.main" fontWeight="bold">
                                        ₹{studentPayments.reduce((sum, p) => sum + p.amount, 0)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Transaction History
                                </Typography>
                                {studentPayments.length > 0 ? (
                                    <List dense>
                                        {studentPayments.map((payment) => (
                                            <ListItem key={payment.id} divider>
                                                <ListItemText
                                                    primary={`₹${payment.amount} - ${payment.remarks || 'No remarks'}`}
                                                    secondary={new Date(payment.date).toLocaleDateString()}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" fontStyle="italic">
                                        No transaction records found.
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BatchFees;