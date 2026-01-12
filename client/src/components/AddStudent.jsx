import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// 1. Dummy Batch List (In real app, this comes from your Database)
const EXISTING_BATCHES = [
    { id: 1, name: 'Class 10 - Science' },
    { id: 2, name: 'Class 12 - Maths' },
    { id: 3, name: 'JEE Mains Batch' },
    { id: 4, name: 'NEET Droppers' },
];

export default function AddStudent() {
    const navigate = useNavigate();
    // State for the Batch Dropdown
    const [selectedBatch, setSelectedBatch] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Student Added");
        // Add your submission logic here
    };

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 2, mb: 4 }}>
            {/* Page Header with Back Button */}
            <Stack direction="row" alignItems="center" mb={3}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, display: { md: 'none' } }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">
                    Add New Student
                </Typography>
            </Stack>

            {/* Main Form Card */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" color="primary.main" fontWeight="600" gutterBottom>
                            Student Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter the personal details of the student.
                        </Typography>
                        <Divider sx={{ mt: 1.5 }} />
                    </Box>


                    <Stack spacing={3}>
                        {/* Row 1: Name and DOB */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            {/* 1. Student Name */}
                            <TextField
                                required
                                fullWidth
                                id="student-name"
                                label="Student Full Name"
                                placeholder="e.g. Rahul Sharma"
                                variant="outlined"
                            />

                            {/* 2. Date of Birth */}
                            <TextField
                                required
                                fullWidth
                                id="dob"
                                label="Date of Birth"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>

                        {/* Row 2: Phone and Batch */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            {/* 3. Student Phone (Optional) */}
                            <TextField
                                fullWidth
                                id="student-phone"
                                label="Student Phone (Optional)"
                                type="tel"
                                placeholder="9876543210"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                            />

                            {/* 4. Batch Selection (Dropdown) */}
                            <TextField
                                select
                                required
                                fullWidth
                                id="batch-select"
                                label="Assign Batch"
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                helperText="Select the class this student belongs to"
                            >
                                {EXISTING_BATCHES.map((batch) => (
                                    <MenuItem key={batch.id} value={batch.id}>
                                        {batch.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        <Box sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="h6" color="primary.main" fontWeight="600" gutterBottom>
                                Guardian Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Contact information for parents or guardians.
                            </Typography>
                            <Divider sx={{ mt: 1.5 }} />
                        </Box>

                        {/* Row 3: Parent Name and Phone */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            {/* 5. Parent Name */}
                            <TextField
                                required
                                fullWidth
                                id="parent-name"
                                label="Parent / Guardian Name"
                                placeholder="e.g. Amit Sharma"
                            />

                            {/* 6. Parent Phone (Required) */}
                            <TextField
                                required
                                fullWidth
                                id="parent-phone"
                                label="Parent Phone Number"
                                type="tel"
                                placeholder="9876543210"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                                helperText="Used for fee reminders & attendance alerts"
                            />
                        </Stack>

                        {/* --- BUTTONS --- */}
                        <Stack direction="row" justifyContent="flex-start" spacing={2} sx={{ mt: 4 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"

                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{ px: 4 }}
                            >
                                Register Student
                            </Button>
                        </Stack>

                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}