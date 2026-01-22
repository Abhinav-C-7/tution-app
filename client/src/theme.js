// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    // OPTIONAL: Turn this on for that "Material 3" look
    // cssVariables: true, 

    palette: {
        mode: 'light', // Change to 'dark' for dark mode
        primary: {
            main: '#1976d2', // This is the default "MUI Blue". Change this to your brand color!
        },
        secondary: {
            main: '#9c27b0', // Your accent color
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        button: {
            textTransform: 'none', // This removes the ALL CAPS from buttons (looks more modern)
        },
    },
    shape: {
        borderRadius: 8, // Increase this (e.g., 12 or 16) for rounder cards/buttons
    },
});

export default theme;