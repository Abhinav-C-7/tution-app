import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// 1. You already imported these, which is great!
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    {/* 2. Add ThemeProvider here and pass your theme */}
    <ThemeProvider theme={theme}>
      {/* 3. Add CssBaseline here to clean up browser styles */}
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  </BrowserRouter>,
);