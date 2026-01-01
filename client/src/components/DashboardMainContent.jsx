
import BatchList from "./BatchList";
import Text from "./Text";

const DashboardMainContent = () => {
  return (
    <div className="flex flex-col gap-28 p-16">
       <Text variant="title" className="">Your batches</Text>
      <BatchList/>
  <BatchList/>
    </div>
  );
};

export default DashboardMainContent;