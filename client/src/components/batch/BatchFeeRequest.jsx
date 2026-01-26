
import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from '../../api/axios';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form'; // 👈 Import this


const BatchFeeRequest = () => {

    const { id } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: "",
            fee: "",
            deadline: new Date()
        }
    });

    const handleCreateFeeRequest = async (data) => {
        const dateObject = new Date(data.deadline);
        const formattedDate = dateObject.toISOString();
        console.log(formattedDate);
        try {
            await api.post(`/feerequests`, { // Corrected endpoint
                name: data.name,
                amount: parseInt(data.fee),
                dueDate: formattedDate,
                batchId: parseInt(id) // Ensure batchId is an integer
            });

        } catch (error) {
            console.error("Setup failed", error);
            alert("Failed to save fee structure");
        }
    };

    return (

        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Card sx={{ p: 4, width: '100%', maxWidth: 600 }}>
                <Typography variant="h5" gutterBottom mb={3} fontWeight="bold">Create New Fee Request</Typography>
                <Stack spacing={3}>

                    <TextField
                        label=" Fee Request Name "
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    <TextField
                        label=" Fee Amount "
                        type="number"
                        {...register("fee", { required: "Fee is required" })}
                        error={!!errors.fee}
                        helperText={errors.fee?.message}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />

                    <DatePicker
                        label="Deadline"
                        value={register.deadline}
                        onChange={(newValue) => {
                            setValue("deadline", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDate={new Date()}
                    />

                    <Button variant="contained" size="large" onClick={handleSubmit(handleCreateFeeRequest)}>

                        Create Fe Request
                    </Button>
                </Stack>
            </Card>
        </Box>

    )

}

export default BatchFeeRequest
