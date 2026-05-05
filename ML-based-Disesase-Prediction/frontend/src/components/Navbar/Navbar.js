import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/auth.api" ;

const Navbar = ({ sidebarOpen }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        setUser(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: sidebarOpen ? "260px" : "0px",
        width: sidebarOpen ? "calc(100% - 260px)" : "100%",
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        zIndex: 200,
        transition: "all 0.3s ease"
      }}
    >
      {/* LEFT */}
      <strong style={{ marginLeft: "40px" }}>
        MediRx – AI Health Assistant
      </strong>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-3">
        <span style={{ cursor: "pointer" }}>⭐</span>

        {user && (
          <div
            className="d-flex align-items-center"
            style={{
              padding: "5px 10px",
              border: "1px solid #ddd",
              borderRadius: "10px"
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#2a9d8f",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px"
              }}
            >
              {user.name?.charAt(0)}
            </div>

            <div className="ms-2" style={{ lineHeight: "1" }}>
              <div style={{ fontSize: "13px", fontWeight: "600" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>
                {user.email}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;