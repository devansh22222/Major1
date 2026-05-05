import { useState } from "react";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);

      window.location.href = "/";   // redirect to home
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f5f7fb" }}
    >
      <div
        className="p-4"
        style={{
          width: "350px",
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #e5e7eb"
        }}
      >
        <h4 className="mb-3 text-center">Login</h4>

        <input
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handleSubmit}
        >
          Login
        </button>

        <div className="text-center">
          Don't have an account?{" "}
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;