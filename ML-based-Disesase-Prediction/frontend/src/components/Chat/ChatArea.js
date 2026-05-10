import { useState, useEffect, useRef } from "react";
import WelcomeScreen from "./WelcomeScreen";
import Loader from "../Common/Loader";
import { sendMessageAPI } from "../../api/chat.api";

const ChatArea = ({
  sidebarOpen
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue("");
    setError("");

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { type: "user", text: userMessage, timestamp: new Date() },
    ]);

    setLoading(true);

    try {
      const response = await sendMessageAPI(userMessage);

      if (response.success) {
        // Add bot reply to chat
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: response.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        setError(response.error || "Failed to get response");
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "I encountered an error processing your message. Please try again.",
            timestamp: new Date(),
            isError: true,
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: errorMessage,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginLeft: sidebarOpen ? "260px" : "0px",
        transition: "all 0.3s ease",
      }}
    >
      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          paddingTop: "70px",
          paddingBottom: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            width: "100%",
            margin: "0 auto",
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
                      msg.type === "user" ? "flex-end" : "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: "15px",
                      backgroundColor:
                        msg.type === "user"
                          ? "#2a9d8f"
                          : msg.isError
                            ? "#e76f51"
                            : "#f0f0f0",
                      color: msg.type === "user" || msg.isError ? "#fff" : "#333",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "15px",
                      backgroundColor: "#f0f0f0",
                      color: "#666",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <span>Thinking</span>
                      <span
                        style={{
                          animation: "dot-animation 1.5s steps(4, end) infinite",
                        }}
                      >
                        ••• 
                      </span>
                    </div>
                    <style>
                      {`
                        @keyframes dot-animation {
                          0%, 20% { content: ""; }
                          40% { content: "."; }
                          60% { content: ".."; }
                          80%, 100% { content: "..."; }
                        }
                      `}
                    </style>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Form - Sticky at Bottom */}
      <div
        style={{
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
          padding: "15px",
          marginLeft: sidebarOpen ? "260px" : "0px",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {error && (
            <div
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#ffe8e8",
                color: "#c82333",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about health..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "25px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "text",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "#2a9d8f")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "#ddd")
              }
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  loading || !inputValue.trim() ? "#ccc" : "#2a9d8f",
                color: "#fff",
                border: "none",
                borderRadius: "25px",
                cursor: loading || !inputValue.trim() ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                !loading && inputValue.trim()
                  ? (e.target.style.backgroundColor = "#237d6c")
                  : null
              }
              onMouseLeave={(e) =>
                !loading && inputValue.trim()
                  ? (e.target.style.backgroundColor = "#2a9d8f")
                  : null
              }
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;