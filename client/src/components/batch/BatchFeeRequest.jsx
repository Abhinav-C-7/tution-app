
import { Box, Button, Card, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';

const BatchFeeRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control, // Use Controller for MUI components
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({

    });

    const handleCreateFeeRequest = async (data) => {
        setIsSubmitting(true);
        try {
            await api.post(`/feerequests`, {
                name: data.name,
                amount: parseInt(data.amount),
                dueDate: data.dueDate.toISOString(),
                batchId: parseInt(id)
            });
            alert('Fee Request Created Successfully!');
            // Redirect to the main fee page for this batch
            navigate(`/batches/${id}/fees`);

        } catch (error) {
            console.error("Setup failed", error);
            alert("Failed to create fee request.");
            setIsSubmitting(false);
        }
        // No need to set isSubmitting to false on success because we are navigating away
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Card sx={{ p: 4, width: '100%', maxWidth: 600 }}>
                <Typography variant="h5" gutterBottom mb={3} fontWeight="bold">Create New Fee Request</Typography>
                <Stack spacing={3} component="form" onSubmit={handleSubmit(handleCreateFeeRequest)}>
                    <TextField
                        label="Fee Request Name"
                        fullWidth
                        disabled={isSubmitting}
                        {...register("name", { required: "Name is required" })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    <TextField
                        label="Fee Amount"
                        type="number"
                        fullWidth
                        disabled={isSubmitting}
                        {...register("amount", {
                            required: "Fee amount is required",
                            valueAsNumber: true,
                            validate: value => value > 0 || "Amount must be positive"
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />

                    <Controller
                        name="dueDate"
                        control={control}
                        rules={{ required: "Deadline is required" }}
                        render={({ field, fieldState }) => (
                            <DatePicker
                                {...field}
                                label="Deadline"
                                minDate={new Date()}
                                disabled={isSubmitting}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Fee Request'}
                    </Button>
                </Stack>
            </Card>
        </Box>
    );
}

export default BatchFeeRequest;
