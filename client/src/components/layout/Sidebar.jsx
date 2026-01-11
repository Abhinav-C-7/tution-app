import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ManIcon from '@mui/icons-material/Man';
import { useNavigate, Outlet, useLocation } from 'react-router-dom'; // 1. Import Router hooks
const drawerWidth = 240;

export default function ClippedDrawer() {
    const navigate = useNavigate(); // Hook to change pages
    const location = useLocation(); // Hook to know which page is active
    const MENU_ITEMS = [
        { text: 'Students', icon: <MailIcon />, path: "/students" },
        { text: 'Batches', icon: <ManIcon />, path: "/batches" },
    ];
    return (


        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <Toolbar />
                <List>
                    {MENU_ITEMS.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                // 4. Handle Click: Navigate to the path
                                onClick={() => navigate(item.path)}
                                // 5. Highlight the active item
                                selected={location.pathname === item.path}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />

            </Box>
        </Drawer>


    );
}
