import Navigationbar from "../components/layout/Navigationbar";
import Container from "../components/Container";
import BatchList from "../components/BatchList";
import Sidebar from "../components/layout/Sidebar";




const Dashboard = () => {
  return (
    <div>
          <Navigationbar></Navigationbar>
    <Container className="flex gap-24"><Sidebar ></Sidebar>

        <BatchList></BatchList></Container>
    </div>
  );
};

export default Dashboard;