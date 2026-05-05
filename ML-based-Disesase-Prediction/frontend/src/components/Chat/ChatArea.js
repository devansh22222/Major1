import WelcomeScreen from "./WelcomeScreen";
import ResultCard from "./ResultCard";
import Loader from "../Common/Loader";

const ChatArea = ({
  data,
  loading,
  setSymptoms,
  sidebarOpen,
  userQuery
}) => {

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "260px" : "0px",
          transition: "all 0.3s ease"
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        marginLeft: sidebarOpen ? "260px" : "0px",
        transition: "all 0.3s ease",
        display: "flex",
        justifyContent: "center",
        paddingBottom: "90px",
        paddingTop: "70px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          padding: "20px",
          display: "flex",
          flexDirection: "column"
        }}
      >

        {/* USER MESSAGE */}
        {userQuery && (
          <div
            style={{
              alignSelf: "flex-end",
              background: "#2a9d8f",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: "15px",
              maxWidth: "60%",
              marginBottom: "15px"
            }}
          >
            {userQuery}
          </div>
        )}

        {!data ? (
          <WelcomeScreen setSymptoms={setSymptoms} />
        ) : (
          data.response.results.map((item, i) => (
            <ResultCard key={i} item={item} />
          ))
        )}

      </div>
    </div>
  );
};

export default ChatArea;