import { useParams, useOutletContext } from 'react-router-dom';
import BatchTable from './BatchTable';
import Typography from '@mui/material/Typography';
import api from '../../api/axios';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const BatchDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { searchQuery } = useOutletContext() || { searchQuery: "" };
    const [batch, setBatch] = useState(null);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const response = await api.get(`/batches/${id}`);
                setBatch(response.data);
            } catch (error) {
                console.error("Error fetching batch:", error);
            }
        };
        fetchBatch();
    }, [id]);

    if (!batch) {
        return (
            <Stack spacing={1} sx={{ m: 4 }}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="rectangular" height={50} />
                <Skeleton variant="rectangular" height={50} />
                <Skeleton variant="rectangular" height={50} />
            </Stack>
        );
    }

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {batch.name}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate(`/batches/${id}/add-student`)}>
                    Add Student
                </Button>
            </Box>


            <BatchTable students={batch.students?.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase())) || []} />
        </div>
    );
}
export default BatchDetails;