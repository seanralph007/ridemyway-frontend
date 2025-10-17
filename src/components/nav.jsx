import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./nav.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get first letter of name
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

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

      {/* Desktop Navigation */}
      <div className="navbar-links">
        {user && <Link to="/">Home</Link>}

        {user?.role === "driver" && <Link to="/create">Offer Ride</Link>}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {/* User avatar dropdown */}
        {user && (
          <div className="user-dropdown" ref={dropdownRef}>
            <div className="user-avatar" onClick={toggleDropdown}>
              {user.photo ? (
                <img src={user.photo} alt="avatar" />
              ) : (
                <span>{getInitial(user.name)}</span>
              )}
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to={user.role === "driver" ? "/driver" : "/passenger"}
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeMenu}>
          ☰
        </button>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
        {user?.role === "driver" && (
          <Link to="/create" onClick={closeMenu}>
            Offer Ride
          </Link>
        )}
        {user && (
          <Link
            to={user.role === "driver" ? "/driver" : "/passenger"}
            onClick={closeMenu}
          >
            Profile
          </Link>
        )}
        {user ? (
          <button
            onClick={() => {
              logout();
              closeMenu();
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/signup" onClick={closeMenu}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
