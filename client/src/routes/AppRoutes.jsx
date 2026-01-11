import { Routes, Route } from "react-router";
import BatchPage from "../pages/BatchPage";
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import StudentPage from "../pages/StudentPage";
const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/batches" element={<BatchPage />} />
                <Route path="/students" element={<StudentPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
