import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    // 1. The "Parent" Flex Container
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* 2. The Components */}
      <Navbar />
      <Sidebar />

      {/* 3. The Main Content Area (The "Sponge") */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: '100%' }} // Takes all remaining space
      >
        <Toolbar /> {/* ⚠️ CRITICAL: Invisible Spacer so text isn't hidden by Header */}

        {/* 4. The Magic Window for your pages */}
        <Outlet />

      </Box>
    </Box>
  );
}