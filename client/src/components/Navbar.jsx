import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "white",
      borderBottom: "1px solid #ddd",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    }}
  >
    <h1 style={{ margin: 20 }}>
  SecureShare
</h1>

    <button onClick={handleLogout}>
      Logout
    </button>
  </div>
);
}

export default Navbar;