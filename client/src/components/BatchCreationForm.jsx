import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function BatchCreationForm() {

    const handleSubmit = (event) => {
        event.preventDefault();
        // In the future, you will send this data to your backend
        console.log("Form Submitted");
    };

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}
        >
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Create New Batch
            </Typography>

            <Grid container spacing={3}>

                {/* 1. Batch Name - The most important identifier */}
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="batch-name"
                        label="Batch Name"
                        placeholder="e.g. Class 10 - Full Bundle"
                        helperText="Give a name students will recognize"
                    />
                </Grid>

                {/* 2. Subjects Covered (Flexible Text) */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="batch-subjects"
                        label="Subjects Covered"
                        placeholder="e.g. Maths, Physics, Chemistry"
                        helperText="List all subjects included in this batch"
                    />
                </Grid>

                {/* 3. Flexible Schedule */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="batch-schedule"
                        label="Schedule / Timings"
                        placeholder="e.g. Mon-Fri Evenings"
                        helperText="Or 'Based on Faculty Availability'"
                    />
                </Grid>

                {/* 4. Monthly Fee */}
                <Grid item xs={12} sm={6}>
                    <TextField

                        fullWidth
                        id="batch-fee"
                        label="Fee Amount"
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        placeholder="2500"
                        helperText="Fee amount for this batch"
                    />
                </Grid>


                {/* 6. Buttons */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" color="error">Cancel</Button>
                    <Button type="submit" variant="contained" size="large">Create Batch</Button>
                </Grid>

            </Grid>
        </Box>
    );
}