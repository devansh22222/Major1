import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/auth.api";

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
        width: sidebarOpen
          ? "calc(100% - 260px)"
          : "100%",
        height: "60px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        zIndex: 999,
        transition: "all 0.3s ease"
      }}
    >
      {/* TITLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111827",
            marginLeft: sidebarOpen ? "20px" : "55px"
          }}
        >
          MediRx – AI Health Assistant
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}
      >
        {/* STAR */}
        <button
          style={{
            border: "1px solid #e5e7eb",
            background: "#fff",
            borderRadius: "10px",
            width: "42px",
            height: "42px",
            fontSize: "18px"
          }}
        >
          ⭐
        </button>

        {/* USER */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "6px 10px",
              background: "#fff"
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#2a9d8f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            <div
              style={{
                marginLeft: "10px",
                lineHeight: "1.2"
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#111827"
                }}
              >
                {user.name}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280"
                }}
              >
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