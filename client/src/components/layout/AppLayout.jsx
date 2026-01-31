import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useAuth } from '@clerk/clerk-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // If Clerk has loaded and there's no user, redirect to login
    if (isLoaded && !userId) {
      navigate('/login');
    }
  }, [isLoaded, userId, navigate]);

  // While Clerk is checking the session, show a loading state
  if (!isLoaded) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // If there is no userId after loading, the redirect is in progress.
  // Returning null prevents a flash of the layout.
  if (!userId) {
    return null;
  }

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };



  return (
    // 1. The "Parent" Flex Container
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* 2. The Components */}
      <Navbar handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        handleDrawerClose={handleDrawerClose}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }} // Takes all remaining space
      >
        <Toolbar />

        {/* 4. The Magic Window for your pages */}
        <Outlet />

      </Box>
    </Box>
  );
}