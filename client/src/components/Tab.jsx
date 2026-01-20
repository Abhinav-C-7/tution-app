import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const BatchTabs = () => {
    const { id } = useParams(); // 👈 1. Get the ID from the URL (e.g., "1")
    const navigate = useNavigate();
    const location = useLocation();

    // 2. Determine which tab is active based on the current URL
    // If URL ends with 'fees', val is 1, etc.
    const getCurrentTab = () => {
        const path = location.pathname;
        if (path.includes('/fees')) return 1;
        if (path.includes('/attendance')) return 2;
        if (path.includes('/settings')) return 3;
        return 0; // Default to 'Overview' (BatchDetails)
    };

    const [value, setValue] = React.useState(getCurrentTab());

    // Update the active tab when the URL changes (e.g. back button)
    React.useEffect(() => {
        setValue(getCurrentTab());
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // 3. Navigate using the ID we grabbed
        switch (newValue) {
            case 0:
                navigate(`/batches/${id}`);
                break;
            case 1:
                navigate(`/batches/${id}/fees`); // 👈 Now 'id' is defined!
                break;
            case 2:
                navigate(`/batches/${id}/attendance`);
                break;
            case 3:
                navigate(`/batches/${id}/settings`);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Overview" />
                    <Tab label="Fees" />
                    <Tab label="Attendance" />
                    <Tab label="Settings" />
                </Tabs>
            </Box>

            {/* 4. IMPORTANT: This renders the child route (Details, Fees, etc.) */}
            <Outlet />
        </>
    );
};

export default BatchTabs;