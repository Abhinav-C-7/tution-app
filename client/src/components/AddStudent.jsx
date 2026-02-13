import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';


export default function AddStudent() {
    const location = useLocation();


    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [batches, setBatches] = useState([]);
    const { id } = useParams(); // Get batch ID from URL if present();
    const {
        reset,
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            batch: id ? parseInt(id) : ""
        }
    });

    const date = new Date();



    date.setFullYear(date.getFullYear() - 3);


    const maxDateAllowed = date.toISOString().split('T')[0];
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


    useEffect(() => {
        if (id) {
            setValue("batch", parseInt(id));
        }
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/students', {
                ...data,
                batchId: parseInt(data.batch)
            });


            setOpenSnackbar(true);


            setTimeout(() => {

                const targetBatchId = id || data.batch;
                const currentPath = location.pathname;
                console.log(currentPath);
                if (currentPath === "/students/add") {
                    navigate("/students");
                }
                else {
                    navigate(`/batches/${targetBatchId}`);
                }
            }, 2000);


        } catch (error) {
            console.error(error);
            alert("Failed");
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 2, mb: 4 }}>

            <Stack direction="row" alignItems="center" mb={3}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, display: { md: 'none' } }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">
                    Add New Student
                </Typography>
            </Stack>


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

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

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


                            <TextField
                                required
                                fullWidth
                                id="dob"
                                label="Date of Birth"
                                type="date"
                                inputProps={{ max: maxDateAllowed, min: '1980-01-01' }}
                                InputLabelProps={{ shrink: true }}
                                {...register("dob", { required: "Date of Birth is required" })}
                                error={!!errors.dob}
                                helperText={errors.dob?.message}
                            />
                        </Stack>


                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                            <TextField
                                fullWidth
                                id="student-phone"
                                label="Student Phone (Optional)"
                                type="tel"
                                inputProps={{
                                    maxLength: 10,
                                }}
                                inputMode='numeric'
                                placeholder="9876543210"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                                {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9]\d{9}$/, message: "Invalid phone number" } })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />


                            <Controller
                                name="batch"
                                control={control}
                                rules={{ required: "Batch is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        disabled={!!id}
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


                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

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


                            <TextField
                                required
                                fullWidth
                                inputProps={{
                                    maxLength: 10,
                                }}
                                id="parent-phone"
                                label="Parent Phone Number"
                                type="tel"
                                placeholder="9876543210"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                                {...register("parentPhone", { required: "Parent Phone is required", pattern: { value: /^[0-9]\d{9}$/, message: "Invalid phone number" } })}
                                error={!!errors.parentPhone}
                                helperText={errors.parentPhone?.message}
                            />
                        </Stack>


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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Student Registered Successfully! Redirecting...
                </Alert>
            </Snackbar>
        </Box>
    );
}