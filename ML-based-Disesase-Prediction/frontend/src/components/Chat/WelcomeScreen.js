const WelcomeScreen = () => {
  const suggestions = [
    "I have headache and nausea",
    "My throat is sore and I have fever",
    "I have stomach pain after eating",
    "I am having seasonal allergies"
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "750px"
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: "70px",
            height: "70px",
            background: "#e8f7f4",
            borderRadius: "20px",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px"
          }}
        >
          💚
        </div>

        {/* TITLE */}
        <h2
          style={{
            fontWeight: "700",
            color: "#111827",
            marginBottom: "10px"
          }}
        >
          How can I help you today?
        </h2>

        {/* SUBTITLE */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "15px",
            lineHeight: "1.7",
            marginBottom: "30px"
          }}
        >
          Describe your symptoms and get AI-powered
          health guidance, medicine suggestions,
          and wellness advice.
        </p>

        {/* SUGGESTIONS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px"
          }}
        >
          {suggestions.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "12px 18px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                color: "#111827",
                transition: "0.2s"
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;