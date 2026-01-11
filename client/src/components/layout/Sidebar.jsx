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

export default function ClippedDrawer({ mobileOpen, handleDrawerTransitionEnd, handleDrawerClose, drawerWidth }) {
    const navigate = useNavigate(); // Hook to change pages
    const location = useLocation(); // Hook to know which page is active
    const MENU_ITEMS = [
        { text: 'Students', icon: <MailIcon />, path: "/students" },
        { text: 'Batches', icon: <ManIcon />, path: "/batches" },
    ];

    const drawer = (
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
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onTransitionEnd={handleDrawerTransitionEnd}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}
