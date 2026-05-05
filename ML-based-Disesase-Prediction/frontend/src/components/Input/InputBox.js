import { predictDisease } from "../../api/prediction.api";

const InputBox = ({
  symptoms,
  setSymptoms,
  setData,
  setLoading,
  refreshHistory,
  sidebarOpen,
  setUserQuery
}) => {

  const handlePredict = async () => {
    if (!symptoms) return;

    setUserQuery(symptoms);   // 🔥 store user message
    setLoading(true);

    try {
      const res = await predictDisease({ symptoms });
      setData(res);
      refreshHistory();
    } catch (err) {
      console.log(err.response?.data);
      alert("Error");
    }

    setSymptoms("");          // 🔥 clear input
    setLoading(false);
  };

  return (
    <footer
      className="p-3 d-flex justify-content-center"
      style={{
        position: "fixed",                     
        bottom: 0,
        left: sidebarOpen ? "260px" : "0px",   
        width: sidebarOpen ? "calc(100% - 260px)" : "100%",
        background: "#fff",
        borderTop: "1px solid #eee",
        padding: "12px 0",
        transition: "all 0.3s ease",
        zIndex: 100
      }}
    >
      <div
        className="d-flex align-items-center"
        style={{
          width: "60%",
          border: "1px solid #ddd",
          borderRadius: "25px",
          padding: "8px 12px",
          background: "#fafafa"
        }}
      >
        <input
          className="form-control border-0"
          style={{ boxShadow: "none", background: "transparent" }}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms..."
          onKeyDown={(e) => e.key === "Enter" && handlePredict()}
        />

        <button
          className="btn"
          style={{
            background: "#2a9d8f",
            color: "#fff",
            borderRadius: "50%"
          }}
          onClick={handlePredict}
        >
          ➤
        </button>
      </div>
    </footer>
  );
};

export default InputBox;