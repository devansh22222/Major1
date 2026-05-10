# Gemini API Chatbot Integration - Complete Setup Guide

## Overview
This guide explains how to set up and run the Gemini API-based chatbot that integrates with your existing Node.js/Express backend and React frontend.

---

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local or Atlas cloud)
3. **Gemini API Key** (free from Google AI Studio)
4. **npm** package manager

---

## 🔑 Step 1: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click "Create API Key" button
3. Copy the generated API key
4. Keep this key safe - you'll need it for the `.env` file

---

## 📦 Step 2: Install Dependencies

### Backend
```bash
cd ML-based-Disesase-Prediction/backend
npm install
```

The setup will automatically install:
- `@google/generative-ai` (Gemini API SDK)
- And all other existing dependencies

### Frontend
```bash
cd ../frontend
npm install
```

---

## ⚙️ Step 3: Configure Environment Variables

### Backend Configuration

1. **Navigate to backend folder:**
   ```bash
   cd ML-based-Disesase-Prediction/backend
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env
   
   # Or on Linux/Mac
   cp .env.example .env
   ```

3. **Edit `.env` file** with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB (local)
   MONGODB_URI=mongodb://localhost:27017/health-chatbot
   
   # OR MongoDB Atlas (cloud)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   
   # JWT Secret (change this in production)
   JWT_SECRET=your-secret-key-12345
   
   # Gemini API Key (CRITICAL - required for chatbot)
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### Frontend Configuration

The frontend is pre-configured to communicate with `http://localhost:5000/api`.

If you need to change the backend URL, edit:
```
frontend/src/api/axios.js
```

Change the `baseURL` to your backend URL:
```javascript
const instance = axios.create({
  baseURL: "http://your-backend-url/api"
});
```

---

## 🚀 Step 4: Start MongoDB

### Option A: Local MongoDB
```bash
# Windows (if installed)
mongod

# Linux/Mac
mongod --dbpath /usr/local/var/mongodb
```

### Option B: MongoDB Atlas (Cloud)
- Use your connection string in `.env` file
- No local MongoDB needed

---

## ▶️ Step 5: Run the Backend Server

```bash
cd ML-based-Disesase-Prediction/backend

# Start the server
npm start

# You should see:
# Node server running on port 5000
```

The backend will:
- Connect to MongoDB
- Validate Gemini API key
- Listen for chat messages on port 5000

---

## ▶️ Step 6: Run the Frontend (In a new terminal)

```bash
cd ML-based-Disesase-Prediction/frontend

# Start the development server
npm start

# Browser will open automatically at http://localhost:3000
```

---

## 🧪 Step 7: Test the Chatbot

1. **Navigate to the app**: http://localhost:3000
2. **Login/Register** with your credentials
3. **Go to the Chat section**
4. **Type a health-related question**, e.g.:
   - "What are the symptoms of flu?"
   - "How can I improve my sleep?"
   - "Tell me about vitamins and supplements"
5. **Click Send** and wait for the response

---

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Chat
- `GET /api/chat/history` - Get chat history (requires auth)
- `POST /api/chat/send` - Send message to chatbot (requires auth)

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is diabetes?"}'
```

**Example Response:**
```json
{
  "success": true,
  "message": "What is diabetes?",
  "reply": "Diabetes is a chronic health condition...",
  "chatId": "507f1f77bcf86cd799439011"
}
```

---

## 🐛 Troubleshooting

### Issue: "GEMINI_API_KEY not found"
**Solution:** 
- Check `.env` file exists in backend folder
- Verify `GEMINI_API_KEY` is correctly set
- Restart the backend server

### Issue: MongoDB connection error
**Solution:**
- Ensure MongoDB is running locally, OR
- Verify MongoDB Atlas connection string in `.env`
- Check internet connection if using Atlas

### Issue: CORS errors in browser console
**Solution:**
- Backend CORS is already configured
- Ensure backend is running on port 5000
- Check frontend axios baseURL matches backend

### Issue: 401 Unauthorized when sending message
**Solution:**
- User needs to be logged in
- JWT token should be stored in localStorage
- Frontend axios interceptors automatically attach token

### Issue: Chatbot responses are slow
**Solution:**
- Gemini API calls take 1-3 seconds
- This is normal - app shows "Thinking..." indicator
- Check internet connection speed

### Issue: "Failed to get response from chatbot"
**Solution:**
- Verify Gemini API key is valid
- Check Gemini API quota in Google AI Studio
- Ensure backend has internet access
- Check backend logs for detailed error

---

## 📊 System Architecture

```
┌─────────────────────────┐
│   React Frontend        │
│  (localhost:3000)       │
│  - ChatArea.js          │
│  - InputBox             │
│  - Message Display      │
└────────┬────────────────┘
         │ HTTP/REST
         │ /api/chat/send
         │
┌────────▼────────────────┐
│  Express Backend        │
│  (localhost:5000)       │
│  - Chat Controller      │
│  - Auth Middleware      │
│  - MongoDB Storage      │
└────────┬────────────────┘
         │ REST API
         │ GEMINI_API_KEY
         │
┌────────▼────────────────┐
│   Gemini API            │
│  (Google Cloud)         │
│  - gemini-pro model     │
│  - Process messages     │
│  - Generate responses   │
└─────────────────────────┘
```

---

## 💾 Database Schema

Chat messages are stored in MongoDB with this schema:
```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to User),
  symptoms: String (user message),
  response: {
    answer: String (chatbot reply),
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Notes

1. **Never commit `.env` file** to git
2. **Change JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Store Gemini API key** securely
5. **Implement rate limiting** for production
6. **Add input validation** for user messages

---

## 📚 File Structure

```
ML-based-Disesase-Prediction/
├── backend/
│   ├── .env                    (← Create this from .env.example)
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   ├── controllers/
│   │   └── chat.controller.js  (← Updated for Gemini)
│   ├── routes/
│   │   └── chat.routes.js      (← Updated routes)
│   ├── models/
│   │   └── Chat.js
│   └── middleware/
│       └── auth.middleware.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── chat.api.js     (← Updated API calls)
    │   └── components/
    │       └── Chat/
    │           └── ChatArea.js (← Complete rewrite)
    └── package.json
```

---

## 🚀 Advanced Configuration (Optional)

### Custom Gemini Model
Edit `chat.controller.js` to use different models:
```javascript
// Change from gemini-pro to:
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
```

### Adjust Temperature (Creativity)
Lower = more factual, Higher = more creative:
```javascript
generationConfig: {
  temperature: 0.3,  // Change this (0-1)
  maxOutputTokens: 1024,
}
```

### Modify System Prompt
Edit the `SYSTEM_PROMPT` in `chat.controller.js` to customize chatbot behavior.

---

## 📞 Support

If you encounter issues:
1. Check backend logs: `npm start` output
2. Check browser console: F12 → Console tab
3. Verify Gemini API key validity
4. Ensure MongoDB is running
5. Check environment variables

---

## ✅ Verification Checklist

- [ ] Gemini API key obtained
- [ ] Backend `.env` file created and configured
- [ ] MongoDB running or Atlas connection verified
- [ ] `npm install` completed in both backend and frontend
- [ ] Backend server started (`npm start`)
- [ ] Frontend running (`npm start`)
- [ ] Can login to the application
- [ ] Chat interface loads without errors
- [ ] Can send a message and receive a response
- [ ] Chat history saves correctly

---

## 🎉 You're All Set!

Your Gemini API-based chatbot is now ready to use. Start chatting with your friendly AI doctor!

For more details on Gemini API, visit: https://ai.google.dev/
