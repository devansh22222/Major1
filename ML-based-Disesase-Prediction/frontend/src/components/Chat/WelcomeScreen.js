const WelcomeScreen = ({ setSymptoms, sidebarOpen }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100%",
        marginLeft: sidebarOpen ? "260px" : "0px",
        transition: "all 0.3s ease"
      }}
    >
      <div className="text-center" style={{ maxWidth: "700px" }}>
        
        <div
          className="mx-auto mb-3"
          style={{
            width: 60,
            height: 60,
            background: "#e6f4f1",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          💚
        </div>

        <h3 className="fw-bold">How can I help you today?</h3>

        <p style={{ color: "#6b7280" }}>
          Describe your symptoms and I'll suggest possible conditions,
          medicines, and alternatives.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          {[
            "I have a headache and nausea",
            "My throat is sore and I have a fever",
            "I'm experiencing back pain",
            "I have seasonal allergies"
          ].map((text, i) => (
            <div
              key={i}
              style={{
                padding: "10px 15px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                cursor: "pointer",
                background: "#fff"
              }}
              onClick={() => setSymptoms(text)}
            >
              "{text}"
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;