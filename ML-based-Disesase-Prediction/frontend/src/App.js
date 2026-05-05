// import { useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [symptoms, setSymptoms] = useState("");
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handlePredict = async () => {
//     if (!symptoms) return;
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/predict", {
//         symptoms
//       });
//       setData(res.data);
//     } catch (err) {
//       alert("Error fetching data");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <div className="brand">
//             <span className="logo-icon">M</span>
//             <span className="brand-name">MediRx</span>
//           </div>
//           <button className="icon-btn">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
//           </button>
//         </div>

//         <button className="new-chat-btn" onClick={() => { setData(null); setSymptoms(""); }}>
//           <span>+</span> New Chat
//         </button>

//         <div className="history-section">
//           <label className="section-label">TODAY</label>
//           <div className="history-item"><span>💬</span> Headache & Nausea</div>
//           <div className="history-item"><span>💬</span> Back Pain Query</div>
          
//           <label className="section-label">YESTERDAY</label>
//           <div className="history-item"><span>💬</span> Allergy Symptoms</div>
//           <div className="history-item"><span>💬</span> Cold & Flu</div>
//         </div>

//         <div className="sidebar-footer">
//           <div className="footer-item"><span>🌙</span> Dark Mode</div>
//           <div className="footer-item"><span>⚙️</span> Settings</div>
//           <div className="user-profile">
//             <div className="avatar">P</div>
//             <span>Patient User</span>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         <header className="top-nav">
//           <span className="nav-title">MediRx – AI Health Assistant</span>
//           <div className="nav-icons">
//             <button className="icon-btn">📋</button>
//             <button className="icon-btn">💬</button>
//           </div>
//         </header>

//         <div className="chat-area">
//           {!data && !loading ? (
//             <div className="welcome-screen">
//               <div className="pulse-icon">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
//               </div>
//               <h1>How can I help you today?</h1>
//               <p>Describe your symptoms and I'll suggest possible conditions, recommended medicines, and affordable alternatives.</p>
              
//               <div className="suggestions-grid">
//                 <div className="suggestion-card" onClick={() => setSymptoms("I have a headache and nausea")}>"I have a headache and nausea"</div>
//                 <div className="suggestion-card" onClick={() => setSymptoms("My throat is sore and I have a fever")}>"My throat is sore and I have a fever"</div>
//                 <div className="suggestion-card" onClick={() => setSymptoms("I'm experiencing back pain")}>"I'm experiencing back pain"</div>
//                 <div className="suggestion-card" onClick={() => setSymptoms("I have seasonal allergies")}>"I have seasonal allergies"</div>
//               </div>
//             </div>
//           ) : (
//             <div className="results-container">
//               {loading && <div className="loader"></div>}
//               {data && data.results.map((item, i) => (
//                 <div key={i} className="result-card">
//                   <h2 className="disease-title">🦠 {item.disease}</h2>
//                   <div className="medicine-grid">
//                     {item.medicines.map((med, j) => (
//                       <div key={j} className="med-card">
//                         <div className="med-header">
//                           <h3>{med.name}</h3>
//                           <span className="med-badge">{med.group}</span>
//                         </div>
//                         <p className="med-price">Price: <span>₹{med.price}</span></p>
//                         <div className="med-details">{med.details}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Bottom Input Area */}
//         <footer className="input-area">
//           <div className="input-wrapper">
//             <input 
//               type="text" 
//               placeholder="Describe your symptoms..." 
//               value={symptoms}
//               onChange={(e) => setSymptoms(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handlePredict()}
//             />
//             <div className="input-actions">
//               <button className="icon-btn">🎤</button>
//               <button className="send-btn" onClick={handlePredict}>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
//               </button>
//             </div>
//           </div>
//           <p className="disclaimer">MediRx provides suggestions only. Always consult a healthcare professional.</p>
//         </footer>
//       </main>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/Common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;