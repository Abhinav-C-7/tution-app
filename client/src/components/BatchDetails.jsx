
import { useParams } from 'react-router-dom';
import BatchTable from './BatchTable';
import Typography from '@mui/material/Typography';
const BatchDetails = () => {
    const { id } = useParams();
    return (
        <div>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Batch {id}
            </Typography>

            <BatchTable />
        </div>
    );
}
export default BatchDetails;


