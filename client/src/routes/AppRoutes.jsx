import { Routes, Route } from "react-router";
import BatchPage from "../pages/BatchPage";
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import StudentPage from "../pages/StudentPage";
import BatchDetails from "../components/batch/BatchDetails";
import BatchCreationForm from "../components/batch/BatchCreationForm";
import AddStudent from "../components/AddStudent";
import BatchFees from "../components/batch/BatchFees";
import BatchAttendance from "../components/batch/BatchAttendance";
import BatchSettings from "../components/batch/BatchSettings";
import BatchTabs from "../components/Tab";
const AppRoutes = () => {

    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/batches" element={<BatchPage />} />
                <Route path="/students" element={<StudentPage />} />
                <Route path="/batches/create" element={<BatchCreationForm />} />
                <Route path="/students/add" element={<AddStudent />} />
                <Route element={<BatchTabs />}>
                    <Route path="/batches/:id" element={<BatchDetails />} />
                    <Route path="/batches/:id/fees" element={<BatchFees />} />
                    <Route path="/batches/:id/attendance" element={<BatchAttendance />} />
                    <Route path="/batches/:id/settings" element={<BatchSettings />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
