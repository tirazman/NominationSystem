import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Election System</Link>
      </div>
      <div className="navbar-links">
        <Link to="/register">Phase 1 · Submit Form</Link>

        {user && (user.role === "SYSTEM_UNIT" || user.role === "DOCUMENTATION_UNIT" || user.role === "ADMIN") && (
          <Link to="/lookup">Phase 2 · Lookup</Link>
        )}
        {user && (user.role === "REGISTRATION_PIC" || user.role === "ADMIN") && (
          <Link to="/counter/registration">Registration Counter</Link>
        )}
        {user && (user.role === "SECRETARY_PIC" || user.role === "ADMIN") && (
          <Link to="/counter/secretary">Secretary Counter</Link>
        )}
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span className="badge">{user.username} · {user.role}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link to="/login">Staff login</Link>
        )}
      </div>
    </nav>
  );
}
