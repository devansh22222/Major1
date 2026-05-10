# 🤖 Gemini Chatbot - One-Page Reference Card

## 🚀 SETUP IN 3 STEPS

```
STEP 1: Get API Key
├─ Go to: https://aistudio.google.com/app/apikeys
├─ Click: Create API Key
└─ Copy: AIzaSyXxxxxxxxxxxxxxxxxxxxxx

STEP 2: Configure
├─ cd backend
├─ Copy-Item .env.example .env
├─ Edit .env: Add GEMINI_API_KEY=...
└─ Edit .env: Add MONGODB_URI=...

STEP 3: Run
├─ Backend:   cd backend && npm install && npm start
├─ Frontend:  cd frontend && npm install && npm start
├─ Open:      http://localhost:3000
└─ Login & Chat!
```

---

## 📁 KEY FILES CHANGED

| File | What Changed | Action |
|------|---|---|
| `backend/package.json` | Added Gemini SDK | Run: `npm install` |
| `backend/.env.example` | Config template | Copy to `.env` |
| `backend/controllers/chat.controller.js` | Gemini integration | REWRITTEN |
| `backend/routes/chat.routes.js` | New chat endpoint | MODIFIED |
| `frontend/src/api/chat.api.js` | New API function | MODIFIED |
| `frontend/src/components/Chat/ChatArea.js` | Chat UI | REWRITTEN |

---

## ⚙️ .env CONFIGURATION

```env
# REQUIRED - Get from: https://aistudio.google.com/app/apikeys
GEMINI_API_KEY=AIzaSyXxxxxxxxxxxxxxxxxxxxxx

# MongoDB - Local or Atlas
MONGODB_URI=mongodb://localhost:27017/health-chatbot

# Auth Secret
JWT_SECRET=your_secret_key_here

# Server Port
PORT=5000
```

---

## 🧪 QUICK TESTS

```bash
# Test 1: Backend API
curl http://localhost:5000/
# Expected: "API Running 🚀"

# Test 2: Frontend
# Open: http://localhost:3000
# Should: Load without errors

# Test 3: Chatbot
# Action: Login → Chat → Send "Hello"
# Expected: Response from Gemini within 3 seconds
```

---

## 🔗 API ENDPOINT

```
POST /api/chat/send
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

REQUEST:
{
  "message": "What is diabetes?"
}

RESPONSE:
{
  "success": true,
  "reply": "Diabetes is a chronic condition...",
  "chatId": "507f1f77bcf86cd799439011"
}
```

---

## 🆘 QUICK FIXES

| Problem | Fix |
|---------|-----|
| "GEMINI_API_KEY not found" | Add to .env, restart |
| MongoDB error | Run: `mongod` |
| CORS error | Start backend: `npm start` |
| 401 Unauthorized | Login first |
| "Thinking..." stuck | Check API quota |
| Won't start | Delete node_modules, `npm install` |

---

## 📊 FILE STRUCTURE

```
backend/
├── .env              ← YOUR CONFIG
├── .env.example      ← TEMPLATE
├── package.json      ← Updated
└── controllers/chat.controller.js  ← Gemini code

frontend/
├── src/api/chat.api.js  ← New API
└── src/components/Chat/ChatArea.js  ← New UI
```

---

## 📚 DOCUMENTATION FILES

- `QUICK_START.md` - 5-minute setup
- `GEMINI_CHATBOT_SETUP.md` - Full guide
- `VISUAL_SETUP_GUIDE.md` - Visual diagrams
- `GEMINI_CODE_REFERENCE.md` - Code details
- `IMPLEMENTATION_DETAILS.md` - Technical deep dive
- `TROUBLESHOOTING.md` - Fix problems
- `INTEGRATION_SUMMARY.md` - What changed
- `README_CHATBOT.md` - Complete index

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend: `npm start` shows "port 5000"
- [ ] Frontend: `npm start` opens http://localhost:3000
- [ ] Can login/register
- [ ] Chat section loads
- [ ] Can type message
- [ ] "Thinking..." appears
- [ ] Response within 3 seconds
- [ ] Message displays correctly
- [ ] No console errors (F12)
- [ ] Database stores message

---

## 💡 KEY FEATURES

- ✅ Gemini API integration
- ✅ Real-time messaging
- ✅ Message history
- ✅ JWT authentication
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-scroll
- ✅ Responsive design

---

## 🔐 SECURITY

- ✅ JWT on all endpoints
- ✅ API key in .env (not hardcoded)
- ✅ CORS configured
- ✅ Input validated
- ✅ User-scoped data

---

## 📊 ARCHITECTURE

```
React (Port 3000)
     ↓
Express Backend (Port 5000)
     ↓
Gemini API
     ↓
MongoDB
```

---

## 📱 USAGE

1. **Login** to http://localhost:3000
2. **Go to Chat** section
3. **Type question** in input box
4. **Click Send** or press Enter
5. **Wait** for response (1-3 seconds)
6. **See response** in chat
7. **Repeat** as needed

---

## 🚀 DEPLOYMENT

1. Get Gemini API key
2. Configure .env
3. `npm install` (both folders)
4. Start MongoDB
5. `npm start` backend
6. `npm start` frontend
7. Test & deploy

---

## 💾 CUSTOMIZATION

### Change Chatbot Personality
```javascript
// File: backend/controllers/chat.controller.js
const SYSTEM_PROMPT = `Your custom prompt here...`;
```

### Adjust Response Length
```javascript
maxOutputTokens: 512,  // Shorter = faster
```

### Change Response Creativity
```javascript
temperature: 0.3,  // 0=factual, 1=creative
```

---

## 🔗 USEFUL LINKS

- Gemini API: https://ai.google.dev/
- API Key: https://aistudio.google.com/app/apikeys
- MongoDB: https://www.mongodb.com/
- Express: https://expressjs.com/
- React: https://react.dev/

---

## 📞 SUPPORT

1. Check: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Read: [GEMINI_CHATBOT_SETUP.md](GEMINI_CHATBOT_SETUP.md)
3. Review: [GEMINI_CODE_REFERENCE.md](GEMINI_CODE_REFERENCE.md)
4. Study: [IMPLEMENTATION_DETAILS.md](IMPLEMENTATION_DETAILS.md)

---

## ⏱️ TIMELINE

```
5 min  → Get API key
2 min  → Configure .env
2 min  → npm install backend
3 min  → npm install frontend
1 min  → Start MongoDB
1 min  → Start backend
1 min  → Start frontend
1 min  → Login & test
────
16 min total! 🎉
```

---

## ✨ YOU'RE DONE!

Your Gemini-powered chatbot is ready! 

**Next:** Follow [QUICK_START.md](QUICK_START.md) to begin.

---

*Bookmark this page for quick reference!* 📌
