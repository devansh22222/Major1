import { useEffect, useRef, useState } from "react";

import WelcomeScreen from "./WelcomeScreen";

import { sendMessageAPI } from "../../api/chat.api";


const ChatArea = ({
  sidebarOpen,
  refreshHistory,
  selectedChat,
  setSelectedChat
}) => {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [chatId, setChatId] = useState(null);

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
     FORMAT RESPONSE INTO BOXES
  ========================= */

  const formatDiseaseSections = (text) => {

    if (!text.includes("Disease Name:")) {
      return [{ raw: text }];
    }

    const sections =
      text
        .split("Disease Name:")
        .filter(Boolean)
        .map((section) => {

          const lines =
            section.trim().split("\n");

          const diseaseName =
            lines[0]?.trim();

          const fullText =
            lines.slice(1).join("\n");

          return {
            diseaseName,
            fullText
          };
        });

    return sections;
  };



  /* =========================
     LOAD SELECTED CHAT
  ========================= */

  useEffect(() => {

    if (!selectedChat) {

      setMessages([]);

      setChatId(null);

      return;
    }

    setChatId(selectedChat.id);

    const formattedMessages =
      selectedChat.messages.map((msg) => ({

        type:
          msg.role === "user"
            ? "user"
            : "bot",

        text: msg.content,

        reviewStatus:
          msg.reviewStatus || null,

        doctorNotes:
          msg.doctorNotes || ""
      }));


    setMessages(formattedMessages);

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

      const res =
        await sendMessageAPI({
          message: userMessage,
          chatId
        });

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",

          text: res.reply,

          reviewStatus: "pending"
        }
      ]);


      if (!chatId) {

        setChatId(res.chatId);

        setSelectedChat({
          id: res.chatId,
          title:
            userMessage.substring(0, 40),
          messages: res.messages
        });
      }


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

            messages.map((msg, index) => {

              const diseaseSections =
                msg.type === "bot"
                  ? formatDiseaseSections(msg.text)
                  : [];

              return (

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
                      maxWidth: "80%"
                    }}
                  >

                    {/* USER MESSAGE */}

                    {
                      msg.type === "user" && (

                        <div
                          style={{
                            padding: "14px 18px",

                            borderRadius: "18px",

                            whiteSpace: "pre-wrap",

                            lineHeight: "1.7",

                            background: "#2a9d8f",

                            color: "#fff",

                            boxShadow:
                              "0 2px 10px rgba(0,0,0,0.05)"
                          }}
                        >
                          {msg.text}
                        </div>
                      )
                    }



                    {/* BOT MESSAGE */}

                    {
                      msg.type === "bot" && (

                        <div>

                          {
                            diseaseSections.map(
                              (section, idx) => (

                                <div
                                  key={idx}
                                  style={{
                                    background: "#fff",

                                    border:
                                      "1px solid #e5e7eb",

                                    borderRadius: "18px",

                                    padding: "18px",

                                    marginBottom: "16px",

                                    boxShadow:
                                      "0 2px 10px rgba(0,0,0,0.05)"
                                  }}
                                >

                                  {
                                    section.diseaseName && (

                                      <div
                                        style={{
                                          fontSize: "20px",

                                          fontWeight: "700",

                                          marginBottom: "15px",

                                          color: "#111827"
                                        }}
                                      >
                                        🦠 {
                                          section.diseaseName
                                        }
                                      </div>
                                    )
                                  }

                                  {
                                    section.fullText
                                      ?.split("\n\n")
                                      .map(
                                        (
                                          block,
                                          blockIndex
                                        ) => (

                                          <div
                                            key={blockIndex}

                                            style={{
                                              background:
                                                "#f9fafb",

                                              border:
                                                "1px solid #e5e7eb",

                                              borderRadius:
                                                "14px",

                                              padding:
                                                "14px",

                                              marginBottom:
                                                "12px",

                                              whiteSpace:
                                                "pre-wrap",

                                              lineHeight:
                                                "1.8"
                                            }}
                                          >
                                            {block}
                                          </div>
                                        )
                                      )
                                  }

                                </div>
                              )
                            )
                          }



                          {/* REVIEW STATUS */}

                          {
                            msg.reviewStatus === "pending" && (

                              <div
                                style={{
                                  marginTop: "12px",

                                  fontSize: "13px",

                                  color: "#f59e0b",

                                  fontWeight: "600"
                                }}
                              >
                                ⏳ Waiting for doctor verification
                              </div>
                            )
                          }

                          {
                            msg.reviewStatus === "approved" && (

                              <div
                                style={{
                                  marginTop: "12px",

                                  fontSize: "13px",

                                  color: "#10b981",

                                  fontWeight: "600"
                                }}
                              >
                                ✅ Verified by Doctor
                              </div>
                            )
                          }

                          {
                            msg.reviewStatus === "edited" && (

                              <div
                                style={{
                                  marginTop: "12px",

                                  fontSize: "13px",

                                  color: "#3b82f6",

                                  fontWeight: "600"
                                }}
                              >
                                ✏️ Edited by Doctor
                              </div>
                            )
                          }

                          {
                            msg.reviewStatus === "rejected" && (

                              <div
                                style={{
                                  marginTop: "12px",

                                  fontSize: "13px",

                                  color: "#ef4444",

                                  fontWeight: "600"
                                }}
                              >
                                ❌ Rejected by Doctor
                              </div>
                            )
                          }

                          {
                            msg.doctorNotes && (

                              <div
                                style={{
                                  marginTop: "12px",

                                  padding: "12px",

                                  background: "#fef3c7",

                                  border:
                                    "1px solid #fcd34d",

                                  borderRadius: "12px",

                                  fontSize: "14px",

                                  lineHeight: "1.7"
                                }}
                              >
                                <strong>
                                  Doctor Notes:
                                </strong>

                                <br />

                                {msg.doctorNotes}
                              </div>
                            )
                          }

                        </div>
                      )
                    }

                  </div>

                </div>
              );
            })
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