import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function SideNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const canSeeCandidateData =
    !!user && (user.role === "SYSTEM_UNIT" || user.role === "DOCUMENTATION_UNIT" || user.role === "ADMIN");
  const canSeeRegistrationCounter = !!user && (user.role === "REGISTRATION_PIC" || user.role === "ADMIN");
  const canSeeSecretaryCounter = !!user && (user.role === "SECRETARY_PIC" || user.role === "ADMIN");

  return (
    <aside className="sidenav">
      <div className="sidenav-brand">
        <span className="sidenav-brand-mark">EC</span>
        <span className="sidenav-brand-text">Election System</span>
      </div>

      <nav className="sidenav-links">
        <NavLink to="/register" className={({ isActive }) => (isActive ? "sidenav-link active" : "sidenav-link")}>
          Form Submission
        </NavLink>

        {canSeeCandidateData && (
          <NavLink to="/candidates" className={({ isActive }) => (isActive ? "sidenav-link active" : "sidenav-link")}>
            Candidate Data
          </NavLink>
        )}

        {canSeeRegistrationCounter && (
          <NavLink
            to="/counter/registration"
            className={({ isActive }) => (isActive ? "sidenav-link active" : "sidenav-link")}
          >
            Registration Counter
          </NavLink>
        )}

        {canSeeSecretaryCounter && (
          <NavLink
            to="/counter/secretary"
            className={({ isActive }) => (isActive ? "sidenav-link active" : "sidenav-link")}
          >
            Secretary Counter
          </NavLink>
        )}
      </nav>

      <div className="sidenav-footer">
        {user ? (
          <>
            <div className="sidenav-user">
              <div className="sidenav-user-name">{user.username}</div>
              <div className="sidenav-user-role">{user.role}</div>
            </div>
            <button className="sidenav-logout" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sidenav-link">
            Staff login
          </NavLink>
        )}
      </div>
    </aside>
  );
}
