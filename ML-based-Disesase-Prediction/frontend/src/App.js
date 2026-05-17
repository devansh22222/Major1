import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";

import ProtectedRoute from "./components/Common/ProtectedRoute";


function App() {

  const role =
    localStorage.getItem("role");


  return (
    <BrowserRouter>

      <Routes>

        {/* PATIENT HOME */}

        <Route
          path="/"

          element={
            <ProtectedRoute>

              {
                role === "doctor"
                  ? (
                    <Navigate
                      to="/doctor"
                    />
                  )
                  : (
                    <Home />
                  )
              }

            </ProtectedRoute>
          }
        />


        {/* DOCTOR DASHBOARD */}

        <Route
          path="/doctor"

          element={
            <ProtectedRoute>

              {
                role === "doctor"
                  ? (
                    <DoctorDashboard />
                  )
                  : (
                    <Navigate
                      to="/"
                    />
                  )
              }

            </ProtectedRoute>
          }
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;