import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';

const BatchTabs = () => {
    const [value, setValue] = useState(0);

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
                <Tab label="Overview" />
                <Tab label="Fees" />
                <Tab label="Attendance" />
                <Tab label="Settings" />
            </Tabs>
        </Box>
    );
};

export default BatchTabs;