import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        navigate("/dashboard");

      } else {

        alert(data.message);

      }

    } catch (error) {

      ;

      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
      <h1>SecureShare Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>
        <br /><br />
        <br /><br />

<p
  style={{
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: "bold"
  }}
  onClick={() =>
    navigate("/forgot-password")
  }
>
  Forgot Password?
</p>

<p>
  New User?{" "}
  <span
    style={{
      color: "#2563eb",
      cursor: "pointer",
      fontWeight: "bold"
    }}
    onClick={() => navigate("/signup")}
  >
    Sign Up
  </span>
</p>
      </form>

    </div>
    </div>
  );
}

export default Login;