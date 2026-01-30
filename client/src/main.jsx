import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router"; // (Note: In Vite standard is usually 'react-router-dom', check if this works for you)
import AppRoutes from "./routes/AppRoutes";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// 1. IMPORT CLERK PROVIDER
import { ClerkProvider } from '@clerk/clerk-react';
import AxiosInterceptor from "./components/AxiosInterceptor";

const root = document.getElementById("root");
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// 2. ADD THIS SAFETY CHECK
// This prevents the app from crashing silently if your .env file is missing
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}



ReactDOM.createRoot(root).render(
  // 3. WRAP EVERYTHING WITH CLERK PROVIDER
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <AxiosInterceptor>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <AppRoutes />
          </LocalizationProvider>
        </ThemeProvider>
      </AxiosInterceptor>
    </BrowserRouter>
  </ClerkProvider>
);