import { useState, useEffect, useRef } from "react";
import WelcomeScreen from "./WelcomeScreen";
import { sendMessageAPI } from "../../api/chat.api";

const ChatArea = ({
  sidebarOpen,
  refreshHistory,
  selectedChat
}) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef(null);

  /* =========================
     SCROLL
  ========================= */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  /* =========================
     LOAD SELECTED HISTORY CHAT
  ========================= */

  useEffect(() => {

    if (!selectedChat) {
      setMessages([]);
      return;
    }

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

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = inputValue;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage
      }
    ]);

    setInputValue("");
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

    } catch (err) {

      console.log(err);

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
        flexDirection: "column",
        background: "#f5f7fb"
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
            maxWidth: "900px",
            margin: "0 auto"
          }}
        >

          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <>
              {messages.map((msg, index) => (

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

                      background:
                        msg.type === "user"
                          ? "#2a9d8f"
                          : "#ffffff",

                      color:
                        msg.type === "user"
                          ? "#fff"
                          : "#111827",

                      border:
                        msg.type === "bot"
                          ? "1px solid #e5e7eb"
                          : "none",

                      whiteSpace: "pre-wrap",
                      lineHeight: "1.6",

                      boxShadow:
                        "0 2px 10px rgba(0,0,0,0.05)"
                    }}
                  >
                    {msg.text}
                  </div>

                </div>
              ))}

              {loading && (
                <div className="mb-3">
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      padding: "12px 16px",
                      borderRadius: "15px",
                      width: "fit-content"
                    }}
                  >
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef}></div>
            </>
          )}

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
          borderTop: "1px solid #e5e7eb",
          padding: "15px",
          transition: "all 0.3s ease"
        }}
      >

        <form
          onSubmit={handleSendMessage}
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            gap: "10px"
          }}
        >

          <input
            type="text"
            value={inputValue}
            onChange={(e) =>
              setInputValue(e.target.value)
            }
            placeholder="Describe your symptoms..."
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "30px",
              padding: "14px 18px",
              outline: "none",
              background: "#fafafa"
            }}
          />

          <button
            type="submit"
            style={{
              border: "none",
              background: "#2a9d8f",
              color: "#fff",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              fontSize: "18px"
            }}
          >
            ➤
          </button>

        </form>

      </div>

    </div>
  );
};

export default ChatArea;