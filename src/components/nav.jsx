import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./nav.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>RideMyWay</Link>
        <button className="navbar-toggle" onClick={toggleMenu}>☰</button>
      </div>

      {/* Top Nav Links (shown only on large screens) */}
      <div className="navbar-links">
        <Link to="/">Home</Link>

        {user?.role === "driver" && (
          <Link to="/create">Offer Ride</Link>
        )}

        {user && (
          <Link to={user.role === "driver" ? "/driver" : "/passenger"}>
            Profile
          </Link>
        )}

        {user ? (
          <button className="logout-btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>

      {/* Sidebar for small screens */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeMenu}>×</button>

        <Link to="/" onClick={closeMenu}>Home</Link>

        {user?.role === "driver" && (
          <Link to="/create" onClick={closeMenu}>Offer Ride</Link>
        )}

        {user && (
          <Link to={user.role === "driver" ? "/driver" : "/passenger"} onClick={closeMenu}>
            Profile
          </Link>
        )}

        {user ? (
          <button onClick={() => { logout(); closeMenu(); }}>Logout</button>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/signup" onClick={closeMenu}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
