import { useForm } from 'react-hook-form'; // 👈 Import this
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import api from '../api/axios';

export default function BatchCreationForm() {
    // 1. Setup the hook
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // 2. The Submit Handler (Only runs if validation passes)
    const onSubmit = async (data) => {
        // 'data' is automatically an object: { name: "...", fee: "..." }
        try {
            const response = await api.post('/batches', {
                ...data,             // Spread all fields (name, subjects, schedule)
                fee: parseInt(data.fee) // Ensure fee is a number
            });
            alert("Batch Created!");
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)} // 👈 Connects the handler
            sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}
        >
            <Typography variant="h6" gutterBottom fontWeight="bold">Create New Batch</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Batch Name"
                        // 3. Connect Input to React Hook Form
                        {...register("name", { required: "Batch Name is required" })}
                        // 4. Show Errors automatically
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Subjects Covered"
                        {...register("subjects", { required: "Subjects are required" })}
                        error={!!errors.subjects}
                        helperText={errors.subjects?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Schedule / Timings"
                        {...register("schedule")} // Optional field (no "required")
                    />
                </Grid>

                {/* 4. Fee Input (Closes properly) */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Fee Amount"
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        {...register("fee", { required: "Fee is required", min: 0 })}
                        error={!!errors.fee}
                        // This trick prevents the "Jump" by keeping a blank space if no error exists
                        helperText={errors.fee?.message || " "}
                    />
                </Grid>

            </Grid> {/* End of main container */}

            {/* 5. Buttons (In their own separate row) */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
                <Button variant="outlined" color="error">Cancel</Button>
                <Button type="submit" variant="contained" size="large">Create Batch</Button>
            </Box>
        </Box>
    );
}