import { useState } from "react";
import { registerUser } from "../api/auth.api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async () => {
    try {
      const res = await registerUser(form);

      localStorage.setItem("token", res.data.token);

      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
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
        <h4 className="mb-3 text-center">Register</h4>

        <input
          className="form-control mb-2"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
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
          className="btn btn-success w-100 mb-2"
          onClick={handleSubmit}
        >
          Register
        </button>

        <div className="text-center">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;