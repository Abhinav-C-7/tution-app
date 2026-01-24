import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Tabs, Tab, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';

const BatchTabs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentTab = () => {
        const path = location.pathname;
        if (path.includes('/fees')) return 1;
        if (path.includes('/attendance')) return 2;
        if (path.includes('/settings')) return 3;
        return 0;
    };

    const [value, setValue] = React.useState(getCurrentTab());
    const [searchQuery, setSearchQuery] = useState("");

    React.useEffect(() => {
        setValue(getCurrentTab());
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);

        switch (newValue) {
            case 0:
                navigate(`/batches/${id}`, { replace: true });
                break;
            case 1:
                navigate(`/batches/${id}/fees`, { replace: true });
                break;
            case 2:
                navigate(`/batches/${id}/attendance`, { replace: true });
                break;
            case 3:
                navigate(`/batches/${id}/settings`, { replace: true });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Overview" />
                    <Tab label="Fees" />
                    <Tab label="Attendance" />
                    <Tab label="Settings" />
                </Tabs>
                <TextField
                    placeholder="Search Student..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        mr: 2,
                        width: '250px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            backgroundColor: 'background.paper',
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Outlet context={{ searchQuery }} />
        </>
    );
};

export default BatchTabs;