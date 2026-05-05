import { useState, useEffect } from "react";

const Sidebar = ({ history, setData, setSymptoms, open, setOpen }) => {
  
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    document.body.style.background = dark ? "#111827" : "#f5f7fb";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <>
      {/* ALWAYS VISIBLE TOGGLE (when closed) */}
      {!open && (
        <button
          className="btn"
          style={{
            position: "fixed",
            top: 11,
            left: 10,
            zIndex: 2000,
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff"
          }}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          position: "fixed",
          left: open ? "0px" : "-260px",
          top: 0,
          width: "260px",
          height: "100vh",
          background: dark ? "#1f2937" : "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "15px",
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000
        }}
      >
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                background: "#2a9d8f",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              M
            </div>
            <span
              className="ms-2 fw-bold"
              style={{ color: dark ? "#fff" : "#000" }}
            >
              MediRx
            </span>
          </div>

          {/* INSIDE CLOSE BUTTON */}
          <button
            className="btn btn-sm"
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: dark ? "#374151" : "#fff",
              color: dark ? "#fff" : "#000"
            }}
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* NEW CHAT */}
        <button
          className="btn mb-3"
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: dark ? "#374151" : "#f9fafb",
            color: dark ? "#fff" : "#000"
          }}
          onClick={() => {
            setData(null);
            setSymptoms("");
          }}
        >
          + New Chat
        </button>

        {/* HISTORY */}
        <div style={{ flexGrow: 1, overflowY: "auto",minHeight: 0  }}>
          {history?.map((chat) => (
  <div
    key={chat._id}
    style={{
      padding: "8px",
      cursor: "pointer",
      borderRadius: "8px",
      color: dark ? "#e5e7eb" : "#111827",
      fontSize: "14px"
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = dark ? "#374151" : "#f1f5f9")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = "transparent")
    }
    onClick={() => {
      setData(chat);
      setSymptoms(chat.symptoms);
    }}
  >
    💬 {chat.symptoms || "No symptoms"}
  </div>
))}
        </div>

        {/* BOTTOM */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "10px" }}>
          <div
            style={{
              cursor: "pointer",
              marginBottom: "10px",
              color: dark ? "#fff" : "#000"
            }}
            onClick={() => setDark(!dark)}
          >
            {dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </div>

          <button
            className="btn btn-danger w-100"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;