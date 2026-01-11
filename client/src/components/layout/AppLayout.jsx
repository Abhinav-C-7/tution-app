import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

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

      {/* 3. The Main Content Area (The "Sponge") */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }} // Takes all remaining space
      >
        <Toolbar /> {/* ⚠️ CRITICAL: Invisible Spacer so text isn't hidden by Header */}

        {/* 4. The Magic Window for your pages */}
        <Outlet />

      </Box>
    </Box>
  );
}