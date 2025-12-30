import Container from "./Container";
import BatchCard from "./BatchCard";

const BatchList = () => {
  return (
    <Container className="flex  gap-24">
      <BatchCard />
       <BatchCard />
        <BatchCard />
    </Container>
  );
};

export default BatchList;
