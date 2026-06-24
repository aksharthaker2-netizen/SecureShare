import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
    const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const response = await fetch(
      "http://localhost:5000/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    const data =
      await response.json();

    alert(data.message);
    navigate("/login");
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>Reset Password</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

      </div>

    </div>

  );
}

export default ResetPassword;