import { useEffect, useRef, useState } from "react";

import WelcomeScreen from "./WelcomeScreen";

import { sendMessageAPI } from "../../api/chat.api";


const ChatArea = ({
  sidebarOpen,
  refreshHistory,
  selectedChat
}) => {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);



  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);



  /* =========================
     LOAD HISTORY CHAT
  ========================= */

  useEffect(() => {

    if (!selectedChat) return;

    setMessages([
      {
        type: "user",
        text: selectedChat.message
      },
      {
        type: "bot",
        text: selectedChat.reply
      }
    ]);

  }, [selectedChat]);



  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSend = async () => {

    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage
      }
    ]);

    setInput("");

    setLoading(true);

    try {

      const res = await sendMessageAPI(
        userMessage
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: res.reply
        }
      ]);

      refreshHistory();

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Something went wrong."
        }
      ]);
    }

    setLoading(false);
  };



  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* CHAT BODY */}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "25px",
          paddingBottom: "120px"
        }}
      >

        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto"
          }}
        >

          {messages.length === 0 ? (

            <WelcomeScreen />

          ) : (

            messages.map((msg, index) => (

              <div
                key={index}
                style={{
                  display: "flex",

                  justifyContent:
                    msg.type === "user"
                      ? "flex-end"
                      : "flex-start",

                  marginBottom: "20px"
                }}
              >

                <div
                  style={{
                    maxWidth: "75%",

                    padding: "14px 18px",

                    borderRadius: "18px",

                    whiteSpace: "pre-wrap",

                    lineHeight: "1.7",

                    background:
                      msg.type === "user"
                        ? "#2a9d8f"
                        : "#fff",

                    color:
                      msg.type === "user"
                        ? "#fff"
                        : "#111827",

                    border:
                      msg.type === "bot"
                        ? "1px solid #e5e7eb"
                        : "none",

                    boxShadow:
                      "0 2px 10px rgba(0,0,0,0.05)"
                  }}
                >
                  {msg.text}
                </div>

              </div>
            ))
          )}


          {loading && (

            <div
              style={{
                marginBottom: "20px"
              }}
            >

              <div
                style={{
                  background: "#fff",

                  border:
                    "1px solid #e5e7eb",

                  width: "fit-content",

                  padding: "12px 18px",

                  borderRadius: "16px"
                }}
              >
                Thinking...
              </div>

            </div>
          )}

          <div ref={bottomRef}></div>

        </div>

      </div>



      {/* INPUT */}

      <div
        style={{
          position: "fixed",

          bottom: 0,

          left: sidebarOpen
            ? "260px"
            : "0px",

          width: sidebarOpen
            ? "calc(100% - 260px)"
            : "100%",

          background: "#fff",

          borderTop:
            "1px solid #e5e7eb",

          padding: "15px",

          transition: "all 0.3s ease"
        }}
      >

        <div
          style={{
            maxWidth: "950px",

            margin: "0 auto",

            display: "flex",

            gap: "10px"
          }}
        >

          <input
            value={input}

            onChange={(e) =>
              setInput(e.target.value)
            }

            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleSend()
            }

            placeholder="Describe your symptoms..."

            style={{
              flex: 1,

              border:
                "1px solid #ddd",

              borderRadius: "30px",

              padding: "14px 18px",

              outline: "none",

              background: "#fafafa"
            }}
          />

          <button
            onClick={handleSend}

            style={{
              border: "none",

              background: "#2a9d8f",

              color: "#fff",

              width: "52px",

              height: "52px",

              borderRadius: "50%",

              fontSize: "18px"
            }}
          >
            ➤
          </button>

        </div>

      </div>

    </div>
  );
};

export default ChatArea;