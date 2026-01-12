import Table from "../components/Table";
import { Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
const StudentPage = () => {
    const navigate = useNavigate();
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
            <Table />
        </div>
    );
}
export default StudentPage;