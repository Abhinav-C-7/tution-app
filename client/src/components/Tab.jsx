import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BatchTabs = ({ id }) => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="batch management tabs"
            >
                <Tab label="Overview" onClick={() => navigate(`/batches/${id}`)} />
                <Tab label="Fees" onClick={() => navigate(`/batches/${id}/fees`)} />
                <Tab label="Attendance" onClick={() => navigate(`/batches/${id}/attendance`)} />
                <Tab label="Settings" onClick={() => navigate(`/batches/${id}/settings`)} />
            </Tabs>
        </Box>
    );
};

export default BatchTabs;