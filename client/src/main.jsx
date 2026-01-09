import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import BatchPage from "./pages/BatchPage.jsx";
import App from "./App";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/batches" element={<BatchPage />} />
    </Routes>
  </BrowserRouter>,
);
