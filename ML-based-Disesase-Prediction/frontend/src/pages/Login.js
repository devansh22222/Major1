import { useState } from "react";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(form);

      localStorage.setItem(
        "token",
        res.data.token
      );

      window.location.href = "/";

    } catch (err) {
      alert(
        err.response?.data?.msg ||
        "Login failed"
      );
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "#f5f7fb"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "380px",
          background: "#fff",
          borderRadius: "16px",
          padding: "35px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
        }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "18px",
              background: "#e8f7f4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 15px",
              fontSize: "28px"
            }}
          >
            💚
          </div>

          <h3
            style={{
              fontWeight: "700",
              marginBottom: "8px"
            }}
          >
            Welcome Back
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px"
            }}
          >
            Login to continue using MediRx
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
          style={{
            height: "50px",
            borderRadius: "12px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
          style={{
            height: "50px",
            borderRadius: "12px"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn w-100"
          style={{
            height: "50px",
            background: "#2a9d8f",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "600"
          }}
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <div
          className="text-center mt-3"
          style={{
            fontSize: "14px"
          }}
        >
          Don't have an account?{" "}
          <a href="/register">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;