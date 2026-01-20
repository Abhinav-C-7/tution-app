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
    IconButton,
    Divider,
    Stack,
    Chip,
    LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import api from '../../api/axios';
import BatchTable from './BatchTable';

const BatchAttendance = () => {
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

    // --- Mock Data & Calculation (Since Backend logic for attendance is not fully set) ---
    // In a real app, this would come from an 'attendance' table joined with students.
    // For now, we will generate random stats for demonstration.

    const studentsWithAttendance = batch.students?.map((student, index) => {
        // Deterministic pseudo-random based on index (so it doesn't change on render)
        const totalClasses = 20;
        const present = Math.floor(15 + (index % 5)); // 15 to 19
        const absent = totalClasses - present;
        const percentage = Math.round((present / totalClasses) * 100);

        return {
            ...student,
            totalClasses,
            present,
            absent,
            attendancePercentage: percentage
        };
    }) || [];

    const totalStudents = studentsWithAttendance.length || 1; // Avoid divide by zero
    const avgAttendance = Math.round(
        studentsWithAttendance.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / totalStudents
    );

    // --- Statistics for the Header ---
    const todayPresent = Math.round(totalStudents * 0.85); // Mock: 85% present today

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

    // --- Custom Columns for BatchTable ---
    const attendanceColumns = [
        { id: 'name', label: 'Student Name', minWidth: 170 },
        { id: 'totalClasses', label: 'Total Classes', minWidth: 100, align: 'center' },
        { id: 'present', label: 'Present', minWidth: 100, align: 'center' },
        { id: 'absent', label: 'Absent', minWidth: 100, align: 'center' },
        {
            id: 'attendancePercentage',
            label: 'Attendance %',
            minWidth: 120,
            align: 'center',
            format: (value) => `${value}%` // Not used by BatchTable logic directly but good for ref
        }
    ];

    // Wrap row renderer or rely on BatchTable to just render values?
    // BatchTable renders {value || '-'} or Chip.
    // For %, it will just render the number. To make it look nice (e.g. bold or colored),
    // we might need to modify BatchTable more, but for now let's just pass the data.
    // Actually, I can pass a formatted string in the student object if I want "%" symbol?
    // Let's modify the map to make 'attendancePercentage' a string "85%"?
    // No, better to keep number for sorting if we implement it later.
    // Let's stick to raw numbers for now, maybe add a color indicator in the Dialog.

    return (
        <Box sx={{ p: 0 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Attendance Overview: {batch.name}
            </Typography>

            {/* Statistics Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Avg Attendance"
                        value={`${avgAttendance}%`}
                        subtext="Batch Average"
                        icon={<TrendingUpIcon fontSize="large" />}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Present Today"
                        value={todayPresent}
                        subtext="Students checked in"
                        icon={<EventAvailableIcon fontSize="large" />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Absent Today"
                        value={totalStudents - todayPresent}
                        subtext="Students absent"
                        icon={<EventBusyIcon fontSize="large" />}
                        color="error.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Classes"
                        value="20"
                        subtext="Conducted so far"
                        icon={<AccessTimeIcon fontSize="large" />}
                        color="info.main"
                    />
                </Grid>
            </Grid>

            {/* Student List Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Student Attendance Records
            </Typography>
            <BatchTable
                students={studentsWithAttendance}
                columns={attendanceColumns}
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
                    Attendance Details
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
                                    label={`${selectedStudent.attendancePercentage}% Attendance`}
                                    color={selectedStudent.attendancePercentage >= 75 ? 'success' : 'warning'}
                                />
                            </Box>

                            <Divider />

                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" color="textSecondary">Overall Attendance</Typography>
                                    <Typography variant="body2" fontWeight="bold">{selectedStudent.attendancePercentage}%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={selectedStudent.attendancePercentage}
                                    color={selectedStudent.attendancePercentage >= 75 ? 'success' : 'warning'}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Total Classes</Typography>
                                    <Typography variant="body1">{selectedStudent.totalClasses}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Present</Typography>
                                    <Typography variant="body1" color="success.main" fontWeight="bold">
                                        {selectedStudent.present}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Absent</Typography>
                                    <Typography variant="body1" color="error.main" fontWeight="bold">
                                        {selectedStudent.absent}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Recent History
                                </Typography>
                                <Typography variant="body2" color="textSecondary" fontStyle="italic">
                                    Detailed day-by-day logs are not available yet.
                                </Typography>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BatchAttendance;