import { useState } from "react";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

   

  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h1>Forgot Password</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button type="submit">
            Send Reset Link
          </button>

        </form>

      </div>

    </div>

  );
}

export default ForgotPassword;