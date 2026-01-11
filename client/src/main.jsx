import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
);
