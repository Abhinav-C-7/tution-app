import { createTheme, alpha } from '@mui/material/styles';

// 1. Define your professional colors
const brandColor = '#6366F1'; // Modern Indigo
const secondaryColor = '#10B981'; // Vibrant Emerald

// ... imports

const tealMain = '#0D9488'; // Teal 600
const coralMain = '#F43F5E'; // Rose 500 (Pop color for alerts/important buttons)





const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: tealMain,
            light: '#2DD4BF', // Teal 400
            dark: '#0F766E', // Teal 700
            contrastText: '#ffffff',
        },
        secondary: {
            main: coralMain,
            contrastText: '#ffffff',
        },
        background: {
            default: '#F0FDFA', // A very subtle tint of mint/white (fresh feel)
            paper: '#ffffff',
        },
        // ... rest of the settings (typography, shape) remain the same

        text: {
            primary: '#111827', // Almost black (softer than #000000)
            secondary: '#6B7280', // Cool gray
        },
    },
    typography: {
        // "Inter" is the industry standard for clean UI. 
        // fallback to sans-serif if not loaded.
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 700, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.75rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
        button: {
            textTransform: 'none', // No all-caps
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // More rounded = friendlier UI
    },
    // 2. Override Component Styles (The "Beautiful" part)
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.2)', // Soft colored shadow
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#4f46e5',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Very subtle, expensive-looking shadow
                    border: '1px solid rgba(0,0,0,0.05)', // Subtle border
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                            borderColor: '#E5E7EB', // Light gray border
                        },
                        '&:hover fieldset': {
                            borderColor: brandColor, // Brand color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: '2px', // Thicker border when focused
                            borderColor: brandColor,
                        },
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0, // Flatten papers by default for a clean look
            },
        },
    },
});

export default theme;