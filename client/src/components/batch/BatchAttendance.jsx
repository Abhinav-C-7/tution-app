import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
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
    LinearProgress,
    TextField,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddTaskIcon from '@mui/icons-material/AddTask';

import api from '../../api/axios';
import BatchTable from './BatchTable';

const BatchAttendance = () => {
    const { id } = useParams();
    const { searchQuery } = useOutletContext() || { searchQuery: "" };
    const [batch, setBatch] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Marking Attendance State
    const [markDialogOpen, setMarkDialogOpen] = useState(false);
    const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedForAttendance, setSelectedForAttendance] = useState([]); // Array of student IDs present

    const fetchData = async () => {
        try {
            setLoading(true);
            const batchRes = await api.get(`/batches/${id}`);
            const attendanceRes = await api.get(`/attendance/batch/${id}`);

            setBatch(batchRes.data);
            setAttendanceRecords(attendanceRes.data);

            // Initialize selectedForAttendance with all students (assume all present by default)
            // or empty? Let's default to all present for convenience?
            // Actually, keep it empty to force check? No, usually default all present is better.
            const allStudentIds = batchRes.data.students?.map(s => s.id) || [];
            setSelectedForAttendance(allStudentIds);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleMarkAttendance = async () => {
        try {
            // Prepare records: those in selectedForAttendance are 'Present', others 'Absent'
            const records = batch.students.map(student => ({
                studentId: student.id,
                status: selectedForAttendance.includes(student.id) ? 'Present' : 'Absent'
            }));

            await api.post('/attendance', {
                batchId: id,
                date: markDate,
                records
            });

            setMarkDialogOpen(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };

    const toggleAttendance = (studentId) => {
        setSelectedForAttendance(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    if (loading) return <Box display="flex" justifyContent="center" height="80vh" alignItems="center"><CircularProgress /></Box>;

    if (!batch) {
        return <Typography sx={{ m: 4 }}>Batch not found</Typography>;
    }

    // --- Process Data for Statistics ---
    // We need to aggregate attendance records per student
    // attendanceRecords is flat list of { date, status, studentId }

    // Group records by student
    const studentStats = {};
    batch.students.forEach(s => {
        studentStats[s.id] = { total: 0, present: 0, absent: 0 };
    });

    // Count unique dates? Or assumes one record per student per day?
    // Our backend returns all records. 
    // To get "Total Classes", we should count unique dates that have attendance marked for this batch?
    // Or just count records per student?
    // If we mark specific students as Present/Absent, each entry is a class.

    attendanceRecords.forEach(record => {
        if (!studentStats[record.studentId]) return;

        studentStats[record.studentId].total++;
        if (record.status === 'Present') {
            studentStats[record.studentId].present++;
        } else {
            studentStats[record.studentId].absent++;
        }
    });

    const studentsWithStats = batch.students
        .filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(student => {
            const stats = studentStats[student.id];
            const percentage = stats.total > 0
                ? Math.round((stats.present / stats.total) * 100)
                : 0;

            return {
                ...student,
                totalClasses: stats.total,
                present: stats.present,
                absent: stats.absent,
                attendancePercentage: percentage
            };
        });

    const totalStudents = studentsWithStats.length || 1;
    const avgAttendance = Math.round(
        studentsWithStats.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / totalStudents
    );

    // Today's Stats
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysRecords = attendanceRecords.filter(r => r.date.startsWith(todayStr) || r.date.includes(todayStr));
    // Note: Date passing/parsing issues might occur. Ideally convert both to YYYY-MM-DD.
    // The backend uses `new Date(date)`, so it's stored as timestamp. 
    // We should compare better.
    // Simpler: just count records where date matches today's date string if we stored it as string,
    // but we stored as DateTime. 
    // For now, let's rely on basic string match or just calc "Total Present" across all time (for overview) 
    // or fix "Today" logic? 
    // Let's just calculate "Total Present records" in DB for "Today".

    const isToday = (dateString) => {
        const d = new Date(dateString);
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    const presentToday = attendanceRecords.filter(r => isToday(r.date) && r.status === 'Present').length;
    const absentToday = attendanceRecords.filter(r => isToday(r.date) && r.status !== 'Present').length;
    // Note: absentToday might be incomplete if we haven't marked everyone yet. 
    // But if we use the bulk tool, it marks everyone.

    // Calculate total distinct class dates for the batch
    const uniqueDates = new Set(attendanceRecords.map(r => new Date(r.date).toDateString()));
    const totalClassesConducted = uniqueDates.size;


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
            format: (value) => `${value}%`
        }
    ];

    return (
        <Box sx={{ p: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    Attendance Overview: {batch.name}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddTaskIcon />}
                    onClick={() => {
                        // Reset selection to all students when opening
                        const allStudentIds = batch.students?.map(s => s.id) || [];
                        setSelectedForAttendance(allStudentIds);
                        setMarkDialogOpen(true);
                    }}
                >
                    Mark Attendance
                </Button>
            </Box>

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
                        value={presentToday}
                        subtext="Students checked in"
                        icon={<EventAvailableIcon fontSize="large" />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Absent Today"
                        value={absentToday}
                        subtext="Students absent"
                        icon={<EventBusyIcon fontSize="large" />}
                        color="error.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Classes"
                        value={totalClassesConducted}
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
                students={studentsWithStats}
                columns={attendanceColumns}
                onRowClick={(student) => setSelectedStudent(student)}
            />

            {/* Mark Attendance Dialog */}
            <Dialog
                open={markDialogOpen}
                onClose={() => setMarkDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Mark Attendance</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        value={markDate}
                        onChange={(e) => setMarkDate(e.target.value)}
                        sx={{ mb: 2, mt: 1 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Typography variant="subtitle2" gutterBottom>
                        Uncheck students who are absent:
                    </Typography>
                    <List dense>
                        {batch.students?.map((student) => {
                            const isPresent = selectedForAttendance.includes(student.id);
                            return (
                                <ListItem
                                    key={student.id}
                                    button
                                    onClick={() => toggleAttendance(student.id)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={isPresent}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={`checkbox-list-label-${student.id}`} primary={student.name} />
                                    <Chip
                                        label={isPresent ? "Present" : "Absent"}
                                        color={isPresent ? "success" : "error"}
                                        size="small"
                                        variant="outlined"
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMarkDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleMarkAttendance} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Student Detail Modal (Read-only view) */}
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
                        sx={{ color: (theme) => theme.palette.grey[500] }}
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
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BatchAttendance;