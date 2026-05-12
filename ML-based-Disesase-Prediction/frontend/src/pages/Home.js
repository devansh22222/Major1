import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import ChatArea from "../components/Chat/ChatArea";
import { getHistoryAPI } from "../api/chat.api";

const Home = () => {
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await getHistoryAPI();
      setHistory(res || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        background: "#f5f7fb",
        overflow: "hidden"
      }}
    >
      {/* Sidebar */}
      <Sidebar
        history={history}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        setSelectedChat={setSelectedChat}
      />

      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} />

      {/* Main Chat */}
      <div
        style={{
          marginLeft: sidebarOpen ? "260px" : "0px",
          marginTop: "60px",
          height: "calc(100vh - 60px)",
          transition: "all 0.3s ease"
        }}
      >
        <ChatArea
          sidebarOpen={sidebarOpen}
          refreshHistory={fetchHistory}
          selectedChat={selectedChat}
        />
      </div>
    </div>
  );
};

export default Home;