import { Routes, Route } from "react-router";
import BatchPage from "../pages/BatchPage";
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import StudentPage from "../pages/StudentPage";
import BatchDetails from "../components/BatchDetails";
import BatchCreationForm from "../components/BatchCreationForm";
const AppRoutes = () => {

    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/batches" element={<BatchPage />} />
                <Route path="/students" element={<StudentPage />} />
                <Route path="/batch/:id" element={<BatchDetails />} />
                <Route path="/batches/create" element={<BatchCreationForm />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
