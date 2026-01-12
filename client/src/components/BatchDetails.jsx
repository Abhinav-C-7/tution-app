
import { useParams } from 'react-router-dom';

const BatchDetails = () => {
    const { id } = useParams();
    return (
        <div>
            <h1>Batch Details {id}</h1>
        </div>
    );
}
export default BatchDetails;


