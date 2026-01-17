import { useParams } from 'react-router-dom';
import BatchTable from './BatchTable';
import Typography from '@mui/material/Typography';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const BatchDetails = () => {
    const { id } = useParams();
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
        return <CircularProgress sx={{ mt: 4, ml: 4 }} />;
    }

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                {batch.name}
            </Typography>


            <BatchTable students={batch.students} />
        </div>
    );
}
export default BatchDetails;