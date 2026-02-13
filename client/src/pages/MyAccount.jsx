import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    TextField,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Divider,
    MenuItem
} from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const MyAccount = () => {
    const [value, setValue] = useState(0);
    const [currency, setCurrency] = useState('INR');

    // Placeholder state for form fields
    const [instituteDetails, setInstituteDetails] = useState({
        name: '',
        address: '',
        phone: '',
        website: ''
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInstituteDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };


    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                My Account
            </Typography>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="account settings tabs">
                        <Tab label="Institute Profile" />
                        <Tab label="Settings" />
                    </Tabs>
                </Box>

                {/* Tab 1: Institute Profile */}
                <TabPanel value={value} index={0}>
                    <Typography variant="h6" gutterBottom>
                        Institute Details
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Manage your institute's public information.
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Institute Name"
                                name="name"
                                value={instituteDetails.name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Website"
                                name="website"
                                value={instituteDetails.website}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                multiline
                                rows={3}
                                value={instituteDetails.address}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                name="phone"
                                value={instituteDetails.phone}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </Box>
                </TabPanel>

                {/* Tab 2: Settings */}
                <TabPanel value={value} index={1}>
                    <Typography variant="h6" gutterBottom>
                        Application Settings
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Customize your application experience.
                    </Typography>

                    <Box sx={{ maxWidth: 600 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                            General
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            label="Currency"
                            value={currency}
                            onChange={handleCurrencyChange}
                            helperText="Select your preferred currency for fee displays."
                            sx={{ mb: 3 }}
                        >
                            <MenuItem value="INR">INR (₹)</MenuItem>
                            <MenuItem value="USD">USD ($)</MenuItem>
                            <MenuItem value="EUR">EUR (€)</MenuItem>
                        </TextField>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle1" gutterBottom>
                            Notifications
                        </Typography>
                        <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Email Notifications"
                            sx={{ display: 'block', mb: 1 }}
                        />
                        <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="SMS Notifications (Fees)"
                            sx={{ display: 'block', mb: 1 }}
                        />
                        <FormControlLabel
                            control={<Switch />}
                            label="Marketing Updates"
                            sx={{ display: 'block', mb: 1 }}
                        />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle1" gutterBottom>
                            Appearance
                        </Typography>
                        <FormControlLabel
                            control={<Switch />}
                            label="Dark Mode (Coming Soon)"
                            disabled
                            sx={{ display: 'block', mb: 1 }}
                        />
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary">
                            Save Settings
                        </Button>
                    </Box>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default MyAccount;
