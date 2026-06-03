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
        padding: "15px",
        borderBottom: "1px solid gray",
      }}
    >
      <h2>SecureShare</h2>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;