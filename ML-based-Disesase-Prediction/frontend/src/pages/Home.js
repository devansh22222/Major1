import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import ChatArea from "../components/Chat/ChatArea";
import InputBox from "../components/Input/InputBox";
import { getHistoryAPI } from "../api/chat.api";

const Home = () => {
  const [symptoms, setSymptoms] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userQuery, setUserQuery] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await getHistoryAPI();
      setHistory(res);
      console.log("Chat history fetched:", res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh", background: "#f5f7fb" }}>
      
      <Sidebar
        history={history}
        setData={setData}
        setSymptoms={setSymptoms}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-grow-1 d-flex flex-column">
        
        <Navbar sidebarOpen={sidebarOpen} />

        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div style={{ width: "70%" }}>
            <ChatArea data={data} loading={loading} setSymptoms={setSymptoms} sidebarOpen={sidebarOpen} userQuery={userQuery} />
          </div>
        </div>

        <InputBox
          symptoms={symptoms}
          setSymptoms={setSymptoms}
          setData={setData}
          setLoading={setLoading}
          refreshHistory={fetchHistory}
          sidebarOpen={sidebarOpen}
          setUserQuery={setUserQuery}
        />
      </div>
    </div>
  );
};

export default Home;