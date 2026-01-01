import Container from "./Container";
import BatchCard from "./BatchCard";


const BatchList = () => {
  return (
    <Container className="flex  gap-24">
 <BatchCard index={0} />
<BatchCard index={1} />
<BatchCard index={2} />

    </Container>
  );
};

export default BatchList;
