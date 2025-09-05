import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./nav.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout(); // handled by AuthContext
      navigate("/login"); // redirect after logout
    } catch (err) {
      console.error("❌ Logout failed:", err);
    } finally {
      closeMenu();
    }
  };

  // Links based on authentication & role
  const renderLinks = (isMobile = false) => (
    <>
      <Link to="/" onClick={isMobile ? closeMenu : undefined}>
        Home
      </Link>

      {user?.role === "driver" && (
        <Link to="/create" onClick={isMobile ? closeMenu : undefined}>
          Offer Ride
        </Link>
      )}

      {user && (
        <Link
          to={user.role === "driver" ? "/driver" : "/passenger"}
          onClick={isMobile ? closeMenu : undefined}
        >
          Profile
        </Link>
      )}

      {user ? (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" onClick={isMobile ? closeMenu : undefined}>
            Login
          </Link>
          <Link to="/signup" onClick={isMobile ? closeMenu : undefined}>
            Signup
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          RideMyWay
        </Link>
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Desktop Nav */}
      <div className="navbar-links">{renderLinks(false)}</div>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeMenu}>
          ×
        </button>
        {renderLinks(true)}
      </div>
    </nav>
  );
}
