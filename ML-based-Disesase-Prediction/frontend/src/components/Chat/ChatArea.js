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

          prediction: res.prediction,

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
                  {
  msg.type === "bot" &&
  msg.prediction ? (

    <div>

      {
        msg.prediction.map(
          (item, idx) => (

            <div
              key={idx}
              style={{
                marginBottom: "25px"
              }}
            >

              {/* DISEASE */}

              <div
  style={{
    background:
      "linear-gradient(135deg,#e8f7f4,#f4fbf9)",

    border:
      "1px solid #d1fae5",

    borderRadius: "18px",

    padding: "18px",

    marginBottom: "18px",

    boxShadow:
      "0 4px 15px rgba(0,0,0,0.04)"
  }}
>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }}
  >

    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        background: "#2a9d8f",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px"
      }}
    >
      🩺
    </div>


    <div>

      <div
        style={{
          fontSize: "13px",
          color: "#6b7280",
          fontWeight: "500"
        }}
      >
        Predicted Condition
      </div>

      <div
        style={{
          fontWeight: "700",
          fontSize: "22px",
          color: "#111827",
          marginTop: "3px",
          textTransform: "capitalize"
        }}
      >
        {item.disease}
      </div>

    </div>

  </div>

</div>



              {/* MEDICINES */}

              <div
                style={{
                  marginTop: "10px"
                }}
              >

                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "12px"
                  }}
                >
                  Recommended Medicines
                </div>


                <div
                  className="row g-3"
                >

                  {
                    item.medicines?.map(
                      (med, medIndex) => (

                        <div
                          key={medIndex}
                          className="col-md-6"
                        >

                          <div
                            style={{
                              border:
                                "1px solid #e5e7eb",

                              borderRadius:
                                "18px",

                              padding: "18px",

                              background:
                                "#fff",

                              boxShadow:
                                "0 3px 12px rgba(0,0,0,0.04)",

                              transition:
                                "0.2s"
                            }}
                          >

                            <div
                              className="d-flex justify-content-between"
                            >

                              <div>

                                <div
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "17px",
                                    color: "#111827"
                                  }}
                                >
                                  {med.name}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "13px",

                                    color:
                                      "#6b7280"
                                  }}
                                >
                                  {med.group}
                                </div>

                              </div>


                              <div
                                style={{
                                  background:
                                    "#ecfdf5",

                                  color:
                                    "#059669",

                                  padding:
                                    "6px 12px",

                                  borderRadius:
                                    "999px",

                                  fontWeight:
                                    "700",

                                  fontSize:
                                    "14px"
                                }}
                              >
                                ₹{med.price}
                              </div>

                            </div>



                            <div
                              style={{
                                marginTop:
                                  "12px",

                                fontSize:
                                  "13px",

                                color:
                                  "#374151",

                                whiteSpace:
                                  "pre-wrap"
                              }}
                            >
                              {
                                med.details
                              }
                            </div>

                          </div>

                        </div>
                      )
                    )
                  }

                </div>

              </div>

            </div>
          )
        )
      }

    </div>

  ) : (

    msg.text
  )
}

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

                        {
                          msg.doctorNotes && (

                            <div
                              style={{
                                marginTop: "10px",
                                padding: "10px",
                                background: "#f9fafb",
                                borderRadius: "10px",
                                fontSize: "13px",
                                color: "#374151",
                                border: "1px solid #e5e7eb"
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