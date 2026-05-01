import { useState } from "react";
import axios from "axios";
import "./style.css";
import { useEffect } from "react";

export default function Login({ setToken }) {
    
  const [isRegister, setIsRegister] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      if (isRegister) {
        await axios.post("http://localhost:5000/api/auth/register", data);
        alert("Registered successfully! Now login.");
        setIsRegister(false);
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", data);
localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.user.role); // 👈 ADD THIS
setToken(res.data.token);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="container">
      <div className="card">
            {/* Project Title */}
            <h1 className="app-title">🚀 Team Task Management System</h1>
            <p className="app-subtitle">
                Manage projects, assign tasks, and track team progress efficiently
            </p>

            {/* Page Title */}
            <h3 className="form-title">
                {isRegister ? "Create Account" : "Welcome Back"}
            </h3>
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {isRegister && (
          <input name="name" placeholder="Name" onChange={handleChange} />
        )}

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        {isRegister && (
          <select name="role" onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        )}

        {/* <button onClick={submit}>
          {isRegister ? "Register" : "Login"}
        </button> */}
        <button onClick={() => {
            console.log("Button clicked");
            submit();
            }}>
            {isRegister ? "Register" : "Login"}
            </button>
        <p onClick={() => setIsRegister(!isRegister)} className="link">
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </p>
          <p style={{ marginTop: "15px", fontSize: "12px", color: "gray" }}>
            © 2026 Team Task Management System
            </p>
      </div>
    
    </div>
  );
}