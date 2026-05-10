# Gemini Chatbot - Complete Implementation Details

## 📋 System Architecture

### High-Level Flow
```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                             │
│                    Port: 3000                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ChatArea Component                                       │    │
│  │ - Displays messages                                      │    │
│  │ - Input field                                            │    │
│  │ - Auto-scroll                                            │    │
│  └────────────┬──────────────────────────────────────────┬─┘    │
│               │ sendMessageAPI()                         │        │
│               │ POST /api/chat/send                      │        │
│               └─────────────┬──────────────────────────┬─┘        │
└────────────────────────────────┼──────────────────────┼───────────┘
                                │                      │
┌────────────────────────────────▼──────────────────────▼───────────┐
│                      BACKEND (Express)                             │
│                    Port: 5000                                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Chat Controller (sendMessage)                            │    │
│  │ 1. Validate input                                        │    │
│  │ 2. Initialize Gemini API                                │    │
│  │ 3. Send message with system prompt                      │    │
│  │ 4. Get response                                          │    │
│  │ 5. Save to MongoDB                                       │    │
│  │ 6. Return response to frontend                          │    │
│  └───────────┬──────────────────────────────────────┬──────┘    │
│              │ genAI.getGenerativeModel()          │             │
│              │ model.startChat().sendMessage()     │             │
│              └──────────────────┬───────────────────┘             │
└─────────────────────────────────┼──────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────┐
│                      GEMINI API (Google Cloud)                      │
│                   Model: gemini-pro                                 │
│  - Process natural language                                        │
│  - Generate contextual responses                                   │
│  - Apply system prompt (friendly doctor behavior)                  │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │ Response
┌─────────────────────────────────▼──────────────────────────────────┐
│                      MongoDB Database                               │
│  Collection: chats                                                 │
│  - Store user message                                              │
│  - Store bot response                                              │
│  - Store timestamp                                                 │
│  - Reference user ID                                               │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization

### JWT Flow
```
1. User Login
   ├─ POST /api/auth/login
   ├─ Email + Password
   └─ Returns: JWT Token
      
2. Store Token
   ├─ localStorage.setItem('token', jwt)
   
3. Send Message
   ├─ axios POST /api/chat/send
   ├─ Interceptor adds: Authorization: Bearer {TOKEN}
   
4. Backend Verify
   ├─ authMiddleware validates token
   ├─ Extracts: req.user.id
   └─ Proceeds to sendMessage controller
   
5. Save Associated with User
   └─ Chat.save({ user: req.user.id, ... })
```

---

## 💬 Message Processing Pipeline

### Request → Response Flow
```
USER INPUT
   ↓
Input Validation
   ├─ Check if empty
   ├─ Check max length (optional)
   └─ Trim whitespace
   ↓
Add to Frontend State
   ├─ setMessages([...prev, userMessage])
   ├─ Show in UI
   └─ Set loading = true
   ↓
POST to Backend
   ├─ URL: /api/chat/send
   ├─ Auth: Bearer token
   └─ Body: { message: "..." }
   ↓
BACKEND PROCESSING
   ├─ Validate auth token
   ├─ Validate message
   ├─ Initialize Gemini AI
   │  └─ genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
   ├─ Get model
   │  └─ model = genAI.getGenerativeModel({ model: "gemini-pro" })
   ├─ Build prompt
   │  └─ fullPrompt = SYSTEM_PROMPT + user message
   ├─ Call Gemini API
   │  └─ model.startChat().sendMessage(fullPrompt)
   ├─ Save to MongoDB
   │  └─ new Chat({ user, symptoms, response })
   └─ Return response
      └─ { success, message, reply, chatId }
   ↓
Frontend Receives Response
   ├─ Parse JSON
   ├─ Extract reply
   └─ set loading = false
   ↓
Add Bot Response to State
   ├─ setMessages([...prev, botMessage])
   ├─ Display in UI
   └─ Auto-scroll to bottom
   ↓
USER SEES RESPONSE
```

---

## 🛠️ Code Snippets

### Backend - sendMessage Controller

```javascript
export const sendMessage = async (req, res) => {
  try {
    // 1. Destructure and validate
    const { message } = req.body;
    const userId = req.user.id;
    
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message empty" });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }
    
    // 2. Initialize Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });
    
    // 3. Prepare prompt with system instructions
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;
    
    // 4. Get response from Gemini
    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const botReply = response.text();
    
    // 5. Save to MongoDB
    const newChat = new Chat({
      user: userId,
      symptoms: message,
      response: {
        answer: botReply,
        timestamp: new Date(),
      },
    });
    await newChat.save();
    
    // 6. Return to frontend
    res.json({
      success: true,
      message: message,
      reply: botReply,
      chatId: newChat._id,
    });
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to get response",
      details: error.message,
    });
  }
};
```

### Frontend - ChatArea Component (Key Parts)

```javascript
const ChatArea = ({ sidebarOpen }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMsg = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { type: "user", text: userMsg }]);
    setLoading(true);
    
    try {
      // Call backend
      const response = await sendMessageAPI(userMsg);
      
      // Add bot response
      setMessages(prev => [...prev, { type: "bot", text: response.reply }]);
    } catch (error) {
      // Show error
      setMessages(prev => [...prev, { type: "bot", text: error.message, isError: true }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Messages display */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.type === "user" ? "#2a9d8f" : "#f0f0f0",
            color: msg.type === "user" ? "white" : "black",
            padding: "12px 16px",
            borderRadius: "15px",
            marginBottom: "15px",
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSendMessage} style={{ padding: "15px", borderTop: "1px solid #ddd" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            style={{ flex: 1, padding: "12px", borderRadius: "25px", border: "1px solid #ddd" }}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            style={{
              padding: "12px 24px",
              backgroundColor: loading ? "#ccc" : "#2a9d8f",
              color: "white",
              border: "none",
              borderRadius: "25px",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};
```

---

## 📊 Database Schema

### Chat Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  
  user: ObjectId("507f1f77bcf86cd799439012"),  // Reference to User
  
  symptoms: "What are the symptoms of flu?",  // User's message
  
  response: {
    answer: "The flu (influenza) is a respiratory virus that...",  // Bot's response
    timestamp: ISODate("2024-05-08T10:30:00Z")
  },
  
  createdAt: ISODate("2024-05-08T10:30:00Z"),
  updatedAt: ISODate("2024-05-08T10:30:00Z"),
  
  __v: 0
}
```

### Retrieve Chat History Query
```javascript
// MongoDB query to get last 50 chats for a user
db.chats.find({ user: ObjectId("507f1f77bcf86cd799439012") })
  .sort({ createdAt: -1 })
  .limit(50)
```

---

## 🔒 Security Considerations

### 1. API Key Protection
```env
# NEVER commit .env to git
GEMINI_API_KEY=sk-proj-xxxxxxxxx  # Secrets only in .env
```

### 2. JWT Authentication
```javascript
// All chat endpoints require valid JWT
router.post("/send", authMiddleware, sendMessage);
//            ↑ Protected route

// authMiddleware validates:
// - Token present
// - Token valid signature
// - Token not expired
```

### 3. Rate Limiting (Recommended for Production)
```javascript
// Add to production setup
const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 messages per 15 min
  message: "Too many messages, please try later"
});

router.post("/send", authMiddleware, chatLimiter, sendMessage);
```

### 4. Input Validation
```javascript
// Clean user input
const sanitize = (input) => {
  return input
    .trim()
    .substring(0, 2000)  // Max length
    .replace(/[^\w\s?.,!-]/g, "");  // Remove special chars
};
```

---

## ⚡ Performance Optimization

### 1. Message Pagination
```javascript
// Get only recent messages
router.get("/history/:page", authMiddleware, async (req, res) => {
  const page = req.params.page || 1;
  const limit = 20;
  
  const chats = await Chat.find({ user: req.user.id })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  
  res.json(chats);
});
```

### 2. Caching (Optional)
```javascript
// Cache frequent questions
const cache = new Map();

const getCachedResponse = (message) => {
  const hash = crypto.createHash('md5').update(message).digest('hex');
  return cache.get(hash);
};
```

### 3. Async Gemini Calls
```javascript
// All Gemini calls are async - no blocking
const result = await chat.sendMessage(fullPrompt);
// Non-blocking - UI stays responsive
```

---

## 🧪 Testing Guide

### Backend API Testing (Postman)

**1. Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**2. Send Message**
```
POST http://localhost:5000/api/chat/send
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "message": "What is a healthy diet?"
}

Response:
{
  "success": true,
  "message": "What is a healthy diet?",
  "reply": "A healthy diet typically includes...",
  "chatId": "507f1f77bcf86cd799439011"
}
```

**3. Get History**
```
GET http://localhost:5000/api/chat/history
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
[
  {
    "id": "507f1f77bcf86cd799439011",
    "message": "What is a healthy diet?",
    "reply": "A healthy diet typically includes...",
    "timestamp": "2024-05-08T10:30:00Z"
  }
]
```

---

## 🚨 Error Handling

### Types of Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 400 Bad Request | Empty message | Validate input before sending |
| 401 Unauthorized | Invalid/missing token | Login again, check localStorage |
| 500 API Error | Gemini API down | Retry, check API status |
| 500 DB Error | MongoDB down | Start MongoDB, check connection |
| CORS Error | Backend not running | Start backend: `npm start` |

### Error Handling in Frontend
```javascript
try {
  const response = await sendMessageAPI(message);
  // Success handling
} catch (error) {
  if (error.response?.status === 401) {
    // Re-login required
  } else if (error.response?.status === 500) {
    // Server error - retry
  } else {
    // Network error
  }
}
```

---

## 📈 Monitoring & Debugging

### Backend Logs
```bash
# Run with verbose logging
DEBUG=* npm start

# Check specific logs
npm start 2>&1 | grep "error\|Error\|ERROR"
```

### Frontend Debugging
```javascript
// Browser Console
console.log("Messages:", messages);
console.log("Loading:", loading);

// Network Tab (F12)
// Filter for /api/chat/send requests
// Check Response > reply field
```

### MongoDB Query
```javascript
// Connect to MongoDB and check
mongo
> use health-chatbot
> db.chats.find({ user: ObjectId("...") }).pretty()
```

---

## 🔄 Maintenance

### Regular Tasks
- ✅ Monitor Gemini API quota
- ✅ Check MongoDB storage
- ✅ Review error logs
- ✅ Update dependencies monthly
- ✅ Backup chat data regularly

### Upgrade Path
```bash
# Update Gemini SDK
npm update @google/generative-ai

# Update Express
npm update express

# Update React
npm update react react-dom
```

---

This implementation provides a robust, scalable, and user-friendly chatbot experience!
