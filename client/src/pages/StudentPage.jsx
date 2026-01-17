import Table from "../components/Table";
import { Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";
const StudentPage = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    useEffect(() => {
        const fetchStudents = async () => {
            const response = await api.get('/students');
            setStudents(response.data);
        };
        fetchStudents();
    }, []);
    return (
        <div>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Students
                </Typography>
                <Button onClick={() => navigate('/students/add')}
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{ width: { xs: '300px', sm: 'auto' } }}
                >
                    Add New Student
                </Button>
            </Stack>
            <Table students={students} />
        </div>
    );
}
export default StudentPage;