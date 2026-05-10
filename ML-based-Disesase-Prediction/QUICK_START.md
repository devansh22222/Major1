# Quick Start - Gemini Chatbot

## 🚀 5-Minute Setup

### 1. Get Gemini API Key (2 min)
- Visit: https://aistudio.google.com/app/apikeys
- Click "Create API Key"
- Copy the key

### 2. Configure Backend (2 min)
```bash
cd ML-based-Disesase-Prediction/backend

# Create .env file
Copy-Item .env.example .env

# Edit .env and add:
# GEMINI_API_KEY=your_key_here
# MONGODB_URI=mongodb://localhost:27017/health-chatbot
# JWT_SECRET=secret123
```

### 3. Install & Start (1 min)
```bash
# Install dependencies
npm install

# Start backend
npm start
# Should show: "Node server running on port 5000"
```

### 4. Frontend (In new terminal)
```bash
cd ../frontend
npm install
npm start
# Browser opens at http://localhost:3000
```

### ✅ Done!
- Login to app
- Go to Chat
- Send a message
- Get response from Gemini

---

## 🎯 What You Get

| Feature | Status |
|---------|--------|
| Friendly AI Doctor | ✅ Working |
| Message History | ✅ Saved to DB |
| User Authentication | ✅ JWT Based |
| Real-time Chat | ✅ Instant |
| Error Handling | ✅ Built-in |
| Loading States | ✅ Visual Feedback |

---

## 📍 Key Files Changed

**Backend:**
- `backend/package.json` - Added Gemini package
- `backend/controllers/chat.controller.js` - Gemini integration
- `backend/routes/chat.routes.js` - New /chat/send endpoint
- `backend/.env.example` - Configuration template

**Frontend:**
- `frontend/src/api/chat.api.js` - Added sendMessageAPI
- `frontend/src/components/Chat/ChatArea.js` - Complete chatbot UI

**Documentation:**
- `GEMINI_CHATBOT_SETUP.md` - Full setup guide
- `GEMINI_CODE_REFERENCE.md` - Code details
- `QUICK_START.md` - This file

---

## 🔗 API Endpoint

```
POST /api/chat/send
Authorization: Bearer {JWT_TOKEN}

Body: { "message": "Your question here" }

Response: {
  "success": true,
  "reply": "Chatbot response here..."
}
```

---

## ⚡ Architecture

```
React UI → Express Backend → Gemini API → LLM Response → Save DB
```

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| "GEMINI_API_KEY not found" | Set in .env file, restart backend |
| MongoDB error | Start MongoDB: `mongod` |
| CORS error | Start backend before frontend |
| Slow responses | Normal (Gemini takes 1-3 sec) |
| 401 error | Login first in the app |

---

## 📞 Need Help?

1. Check `GEMINI_CHATBOT_SETUP.md` for detailed guide
2. See `GEMINI_CODE_REFERENCE.md` for code details
3. Check backend console for errors
4. Check browser console (F12) for frontend errors

---

**You're ready to chat! 🎉**
