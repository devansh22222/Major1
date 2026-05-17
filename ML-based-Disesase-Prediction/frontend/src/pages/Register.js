import { useState } from "react";
import { registerUser } from "../api/auth.api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    Gender: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await registerUser(form);

      localStorage.setItem(
        "token",
        res.data.token
      );

      window.location.href = "/";

    } catch (err) {
      alert(
        err.response?.data?.msg ||
        "Registration failed"
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
          width: "400px",
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
            Create Account
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px"
            }}
          >
            Join MediRx AI Health Assistant
          </p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          className="form-control mb-3"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          style={{
            height: "50px",
            borderRadius: "12px"
          }}
        />

                <input
          type="number"
          placeholder="Age"
          className="form-control mb-3"
          value={form.age}
          onChange={(e) =>
            setForm({
              ...form,
              age: e.target.value
            })
          }
          style={{
            height: "50px",
            borderRadius: "12px"
          }}
        />
        <select
          className="form-control mb-3"
          value={form.Gender}
          onChange={(e) =>
            setForm({
              ...form,
              Gender: e.target.value
            })
          }
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

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
          {loading ? "Please wait..." : "Register"}
        </button>

        <div
          className="text-center mt-3"
          style={{
            fontSize: "14px"
          }}
        >
          Already have an account?{" "}
          <a href="/login">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;