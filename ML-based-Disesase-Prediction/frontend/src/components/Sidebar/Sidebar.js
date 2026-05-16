import { useEffect, useState } from "react";

const Sidebar = ({
  history,
  open,
  setOpen,
  setSelectedChat
}) => {

  const [dark, setDark] =
    useState(false);



  /* =========================
     LOAD THEME
  ========================= */

  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");


    if (savedTheme === "dark") {

      setDark(true);

      document.body.style.background =
        "#111827";
    }

  }, []);



  /* =========================
     UPDATE THEME
  ========================= */

  useEffect(() => {

    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );

    document.body.style.background =
      dark
        ? "#111827"
        : "#f5f7fb";

  }, [dark]);



  return (
    <>

      {/* OPEN BUTTON */}

      {!open && (

        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            top: "12px",
            left: "10px",
            zIndex: 2000,
            border: "1px solid #ddd",
            background: "#fff",
            borderRadius: "8px",
            width: "40px",
            height: "40px"
          }}
        >
          ☰
        </button>
      )}



      {/* SIDEBAR */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-260px",
          width: "260px",
          height: "100vh",
          background:
            dark ? "#1f2937" : "#fff",
          borderRight:
            "1px solid #e5e7eb",
          transition: "all 0.3s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          padding: "15px"
        }}
      >

        {/* HEADER */}

        <div
          className="d-flex justify-content-between align-items-center mb-3"
        >

          <div className="d-flex align-items-center">

            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#2a9d8f",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              M
            </div>

            <span
              style={{
                marginLeft: "10px",
                fontWeight: "600",
                color:
                  dark
                    ? "#fff"
                    : "#111827"
              }}
            >
              MediRx
            </span>

          </div>


          <button
            onClick={() => setOpen(false)}
            style={{
              border: "1px solid #ddd",
              background:
                dark
                  ? "#374151"
                  : "#fff",
              color:
                dark
                  ? "#fff"
                  : "#111827",
              borderRadius: "6px",
              width: "32px",
              height: "32px"
            }}
          >
            ✕
          </button>

        </div>



        {/* NEW CHAT */}

        <button
          onClick={() =>
            setSelectedChat(null)
          }

          style={{
            border: "1px solid #ddd",
            background:
              dark
                ? "#374151"
                : "#f9fafb",

            color:
              dark
                ? "#fff"
                : "#111827",

            borderRadius: "10px",

            padding: "10px",

            marginBottom: "15px"
          }}
        >
          + New Chat
        </button>



        {/* HISTORY */}

        <div
          style={{
            flex: 1,
            overflowY: "auto"
          }}
        >

          {history?.map((chat) => (

            <div
              key={chat.id}

              onClick={() =>
                setSelectedChat(chat)
              }

              style={{
                padding: "10px",

                borderRadius: "8px",

                cursor: "pointer",

                color:
                  dark
                    ? "#e5e7eb"
                    : "#111827",

                marginBottom: "5px",

                fontSize: "14px",

                transition: "0.2s"
              }}

              onMouseEnter={(e) =>
                (
                  e.currentTarget.style.background =
                    dark
                      ? "#374151"
                      : "#f3f4f6"
                )
              }

              onMouseLeave={(e) =>
                (
                  e.currentTarget.style.background =
                    "transparent"
                )
              }
            >
              💬 {chat.title}
            </div>
          ))}

        </div>



        {/* FOOTER */}

        <div
          style={{
            borderTop:
              "1px solid #e5e7eb",

            paddingTop: "12px"
          }}
        >

          <div
            style={{
              cursor: "pointer",

              marginBottom: "12px",

              color:
                dark
                  ? "#fff"
                  : "#111827"
            }}

            onClick={() =>
              setDark(!dark)
            }
          >
            {dark
              ? "🌙 Dark Mode"
              : "☀️ Light Mode"}
          </div>


          <button
            className="btn btn-danger w-100"

            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              window.location.href =
                "/login";
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