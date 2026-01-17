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
import { useForm, Controller } from 'react-hook-form'; // 👈 Import this
import api from '../api/axios';
import { useEffect } from 'react';

// 1. Dummy Batch List (In real app, this comes from your Database)


export default function AddStudent() {

    const [batches, setBatches] = useState([]);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await api.get('/batches');
                setBatches(response.data);
                console.log(batches);
            } catch (err) {
                console.log("Error fetching batches:", err);

            }
        };

        fetchBatches();
    }, []);
    const navigate = useNavigate();
    const {
        reset,
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/students', {
                ...data,
                batchId: parseInt(data.batch)
            });
            alert("Student Added!");
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed");
        }
    }
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
                    onSubmit={handleSubmit(onSubmit)}
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
                                {...register("name", { required: "Name is required" })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />

                            {/* 2. Date of Birth */}
                            <TextField
                                required
                                fullWidth
                                id="dob"
                                label="Date of Birth"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register("dob", { required: "Date of Birth is required" })}
                                error={!!errors.dob}
                                helperText={errors.dob?.message}
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
                                inputMode='numeric'
                                placeholder="9876543210"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                                {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9]\d{10}$/, message: "Invalid phone number" } })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />

                            {/* 4. Batch Selection (Dropdown) */}
                            <Controller
                                name="batch" // This is your field name (data.batch)
                                control={control} // Get this from useForm()
                                rules={{ required: "Batch is required" }} // Validation goes here
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field} // This automatically passes value, onChange, onBlur, ref
                                        select
                                        fullWidth
                                        label="Assign Batch"
                                        id="batch-select"
                                        error={!!error}
                                        helperText={error ? error.message : "Select the class this student belongs to"}
                                    >
                                        {batches.map((batch) => (
                                            <MenuItem key={batch.id} value={batch.id}>
                                                {batch.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
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
                                {...register("parentName", { required: "Parent Name is required" })}
                                error={!!errors.parentName}
                                helperText={errors.parentName?.message}
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
                                {...register("parentPhone", { required: "Parent Phone is required" })}
                                error={!!errors.parentPhone}
                                helperText={errors.parentPhone?.message}
                            />
                        </Stack>

                        {/* --- BUTTONS --- */}
                        <Stack direction="row" justifyContent="flex-start" spacing={2} sx={{ mt: 4 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                onClick={() => reset()}
                            >
                                Clear
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