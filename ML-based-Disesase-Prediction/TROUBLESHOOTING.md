# Gemini Chatbot - Troubleshooting & Diagnostics

## 🔧 Diagnostic Tools

### Check 1: Node.js Version
```bash
node --version
# Should be v14 or higher
```

### Check 2: npm Installation
```bash
npm --version
# Should show a version number
```

### Check 3: MongoDB Connection
```bash
# Windows - Start MongoDB
mongod

# In another terminal, test connection
mongo
> show dbs
> exit
```

### Check 4: Backend Can Start
```bash
cd backend
npm install
node server.js
# Should show: "Node server running on port 5000"
```

### Check 5: Gemini API Key Valid
```bash
# In backend terminal, check:
node -e "console.log(process.env.GEMINI_API_KEY)"
# Should show your key (not undefined or empty)
```

---

## ❌ Problem: "GEMINI_API_KEY is undefined"

### Symptoms
```
Error: GEMINI_API_KEY not configured
Failed to get response from chatbot
```

### Diagnosis
1. Check `.env` file exists
   ```bash
   dir backend  # Look for .env file
   ```

2. Check `.env` content
   ```bash
   type backend\.env  # Should show GEMINI_API_KEY=...
   ```

3. Check API key format
   - Should look like: `AIzaSyDxxx...` (not empty)
   - Not: `"your_key_here"` or `your-key`

### Solutions
**Option 1: Create .env file**
```bash
cd backend

# Copy template
Copy-Item .env.example .env

# Edit with notepad
notepad .env
```

**Option 2: Add to existing .env**
```
GEMINI_API_KEY=AIzaSyXxxxxxxxxxxxxxxxxxxxx
```

**Option 3: Test with temporary env var**
```bash
# PowerShell - temporary (session only)
$env:GEMINI_API_KEY="AIzaSyXxxxxxxxxxxxxxxxxxxxx"
npm start

# Linux/Mac
export GEMINI_API_KEY="AIzaSyXxxxxxxxxxxxxxxxxxxxx"
npm start
```

**Option 4: Get new API key**
- Visit: https://aistudio.google.com/app/apikeys
- Create new key
- Copy entire key
- Paste into .env

---

## ❌ Problem: "Cannot connect to MongoDB"

### Symptoms
```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
Error: Server error
```

### Diagnosis
```bash
# Check if MongoDB is running
tasklist | findstr mongo  # Windows
ps aux | grep mongo      # Linux/Mac

# Try connecting
mongo
# If fails: MongoDB not running
```

### Solutions
**Option 1: Start MongoDB (Local)**
```bash
# Windows (if installed)
mongod

# If "command not found", install MongoDB Community Edition

# Linux
sudo service mongod start

# Mac (with Homebrew)
brew services start mongodb-community
```

**Option 2: Use MongoDB Atlas (Cloud)**
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Copy connection string
5. Update .env:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
6. Restart backend
```

**Option 3: Connect to specific host**
```bash
# Edit .env
MONGODB_URI=mongodb://127.0.0.1:27017/health-chatbot

# Restart backend
npm start
```

---

## ❌ Problem: "CORS error" / "No 'Access-Control-Allow-Origin' header"

### Symptoms
```
Access to XMLHttpRequest from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

### Diagnosis
```bash
# Check backend is running
curl http://localhost:5000/

# Should return: "API Running 🚀"

# If error: Backend not running on port 5000
```

### Solutions
**Option 1: Start backend**
```bash
cd backend
npm start

# Verify it shows:
# Node server running on port 5000
```

**Option 2: Check frontend baseURL**
```javascript
// File: frontend/src/api/axios.js
// Should be:
baseURL: "http://localhost:5000/api"

// NOT:
baseURL: "http://127.0.0.1:5000/api"  // Different!
baseURL: "http://localhost:3000/api"  // Wrong!
```

**Option 3: Verify CORS enabled**
```javascript
// backend/server.js should have:
app.use(cors());  // Enable CORS
```

---

## ❌ Problem: "401 Unauthorized" when sending message

### Symptoms
```
{
  "msg": "Invalid token"
}
```

### Diagnosis
```javascript
// Check if logged in
console.log(localStorage.getItem("token"));
// Should show a long string, not null or undefined
```

### Solutions
**Option 1: Login to app**
- Visit http://localhost:3000
- Go to Login page
- Enter credentials (register first if needed)
- Token will be stored automatically

**Option 2: Verify token storage**
```javascript
// Browser console (F12 → Console)
localStorage.getItem("token")
// Should return a JWT token string
```

**Option 3: Check axios interceptor**
```javascript
// File: frontend/src/api/axios.js
// Should have:
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ❌ Problem: "Message stuck on 'Sending...'"

### Symptoms
- Click Send
- "Sending..." button appears
- Never comes back
- No error shown

### Diagnosis
```javascript
// Browser console (F12 → Console)
// Look for errors

// Network tab (F12 → Network)
// Look for /api/chat/send request
// Check if it's pending or failed
```

### Solutions
**Option 1: Check Gemini API quota**
- Visit: https://aistudio.google.com/app/apikeys
- Check usage
- May need to wait or upgrade

**Option 2: Check request in Network tab**
- F12 → Network tab
- Send a message
- Click on /api/chat/send request
- Check Response tab
- Look for error message

**Option 3: Check backend logs**
```
Terminal running `npm start` should show:
- ✓ No errors
- ✓ Error details if request failed
```

**Option 4: Try simpler message**
- Don't send long messages
- Try: "Hello"
- If works, issue may be message length

---

## ❌ Problem: "No response from backend"

### Symptoms
```
Error: Network Error
Backend not responding
Cannot POST /api/chat/send
```

### Diagnosis
```bash
# Check if backend is running
curl http://localhost:5000/

# If fails:
# Backend not running or wrong port
```

### Solutions
**Option 1: Start backend**
```bash
cd backend
npm start

# Terminal should show:
# Node server running on port 5000
```

**Option 2: Check if port 5000 is in use**
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000

# If in use, kill it:
# Windows (in PowerShell Admin)
Stop-Process -Id <PID> -Force

# Linux/Mac
kill -9 <PID>
```

**Option 3: Use different port**
```env
# Edit .env
PORT=5001  # Change from 5000

# Edit frontend axios.js
baseURL: "http://localhost:5001/api"

# Restart both
```

---

## ❌ Problem: "Frontend shows 404"

### Symptoms
```
Cannot GET /
Blank page
Frontend not loading
```

### Diagnosis
```bash
# Check if frontend is running
# Browser should show something at http://localhost:3000
```

### Solutions
**Option 1: Start frontend**
```bash
cd frontend
npm start

# Should open browser at http://localhost:3000
# If not, manually visit: http://localhost:3000
```

**Option 2: Check node_modules**
```bash
# If npm install didn't work:
cd frontend
rm -r node_modules package-lock.json

# Reinstall
npm install
npm start
```

**Option 3: Check port 3000 available**
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Kill if needed (see above)
```

---

## ❌ Problem: "npm install fails"

### Symptoms
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

### Diagnosis
```bash
npm --version
# Should be 6.0+

node --version
# Should be v14+
```

### Solutions
**Option 1: Update npm**
```bash
npm install -g npm@latest
```

**Option 2: Force install**
```bash
npm install --legacy-peer-deps
```

**Option 3: Clear cache**
```bash
npm cache clean --force
npm install
```

**Option 4: Use fresh setup**
```bash
# Delete and recreate
rm -r node_modules package-lock.json
npm install

# Or Windows:
rmdir /s node_modules
del package-lock.json
npm install
```

---

## ✅ Verification Tests

### Test 1: Backend API responds
```bash
curl http://localhost:5000/
# Should return: "API Running 🚀"
```

### Test 2: Frontend loads
```
Browser: http://localhost:3000
Should load without errors
```

### Test 3: Can authenticate
1. Register new user (Frontend)
2. Login successfully
3. Token appears in localStorage (F12 → Application)

### Test 4: MongoDB stores data
```bash
mongo
> use health-chatbot
> db.users.findOne()  # Should exist if registered
> exit
```

### Test 5: Send message (Full flow)
1. Login
2. Navigate to Chat
3. Type: "Hello"
4. Click Send
5. See "Thinking..." indicator
6. Get response from Gemini
7. Message displays in chat

### Test 6: Check database
```bash
mongo
> use health-chatbot
> db.chats.findOne()
> # Should show your chat message and Gemini's response
```

---

## 🔍 Debug Mode

### Enable detailed logging (Backend)
```bash
# Windows PowerShell
$env:DEBUG="*"
npm start

# Linux/Mac
DEBUG=* npm start
```

### Check all requests (Frontend)
```javascript
// In browser console (F12)
// Enable interceptor logging

// Add to frontend/src/api/axios.js
instance.interceptors.response.use(
  response => {
    console.log("✅ Response:", response.data);
    return response;
  },
  error => {
    console.error("❌ Error:", error.response?.data);
    return Promise.reject(error);
  }
);
```

### Monitor network requests
```
Browser F12 → Network tab
- Select "XHR" filter
- Send a message
- Click /api/chat/send request
- Check:
  - Request: method, headers, body
  - Response: status code, data
  - Timing: how long it took
```

---

## 📋 Debugging Checklist

Before reporting issues:
- [ ] Backend running? (`npm start` shows port)
- [ ] Frontend running? (Can access http://localhost:3000)
- [ ] MongoDB running? (Connected or using Atlas)
- [ ] .env file exists? (backend/.env present)
- [ ] GEMINI_API_KEY set? (Check in .env)
- [ ] Logged in to app? (Token in localStorage)
- [ ] No console errors? (F12 → Console tab)
- [ ] Network request successful? (F12 → Network, check response)
- [ ] Backend terminal shows no errors? (npm start output)

---

## 🚨 If All Else Fails

### Start completely fresh
```bash
# Stop all running services (Ctrl+C)

# Delete everything
cd backend
rm -r node_modules
del package-lock.json

cd ../frontend
rm -r node_modules
del package-lock.json

# Reinstall
cd ../backend
npm install
npm start

# New terminal
cd ../frontend
npm install
npm start
```

### Manual testing
```bash
# Terminal 1: Test backend API directly
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Should return token or error (both are OK)
```

### Create minimal test
Create `backend/test.js`:
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent("Hello");
  console.log(result.response.text());
}

test();
```

Run it:
```bash
node test.js
# If works: Gemini API is OK
# If fails: Check API key or internet
```

---

## 📞 Getting Help

1. **Check the docs**
   - GEMINI_CHATBOT_SETUP.md
   - GEMINI_CODE_REFERENCE.md
   - IMPLEMENTATION_DETAILS.md

2. **Check browser console** (F12 → Console)
   - Look for red error messages
   - Note the exact error

3. **Check backend terminal**
   - See if error appears when you send message
   - Copy the exact error

4. **Check network request** (F12 → Network)
   - Send message
   - Look at /api/chat/send
   - Check Response tab
   - See what server returned

5. **Run diagnostic**
   - Follow test steps above
   - Identify which test fails
   - Fix that specific issue

---

## ⚡ Quick Fixes (Most Common)

```
Problem                          | Quick Fix
---------------------------------|----------------------------------
"GEMINI_API_KEY not found"       | Add to .env, restart
MongoDB error                    | Start MongoDB: mongod
CORS error                        | Start backend: npm start
401 Unauthorized                 | Login to app first
Slow responses                   | Normal (Gemini takes time)
npm install fails                | Use --legacy-peer-deps flag
Backend won't start              | Change PORT in .env
Frontend won't load              | Check baseURL in axios.js
Message stuck sending            | Check Gemini API quota
```

---

This should help you diagnose and fix 99% of issues! 🚀
