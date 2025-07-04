// import { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "./Navbar.css";

// export default function Navbar() {
//   const { user, logout } = useContext(AuthContext);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => setMenuOpen(!menuOpen);
//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <nav className="navbar">
//       <div className="navbar__brand">
//         <Link to="/" onClick={closeMenu}>RideMyWay</Link>
//         <button className="navbar__toggle" onClick={toggleMenu}>
//           ☰
//         </button>
//       </div>

//       <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
//         <Link to="/" onClick={closeMenu}>Home</Link>
//         {user ? (
//           <>
//             {/* <span className="navbar__welcome">Welcome, {user.name}</span> */}
//             {user.role === "driver" && (
//               <div className="nav-link">
//                 <Link to="/create" onClick={closeMenu}>Offer Ride</Link>
//                 <Link to="/driver" onClick={closeMenu} className="profile">Profile</Link>
//               </div>
//             )}
//             {user.role === "passenger" && (
//               <div>
//                 <Link to="/passenger" onClick={closeMenu}>Profile</Link>
//               </div>
//             )}
//             <button className="logout" onClick={() => { logout(); closeMenu(); }}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" onClick={closeMenu}>Login</Link>
//             <Link to="/signup" onClick={closeMenu}>Signup</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// src/components/Navbar.jsx
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/" onClick={closeMenu}>RideMyWay</Link>
        <button className="navbar__toggle" onClick={toggleMenu}>☰</button>
      </div>

      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeMenu}>×</button>

        <Link to="/" onClick={closeMenu}>Home</Link>

        {user && user.role === "driver" && (
          <Link to="/create" onClick={closeMenu}>Offer Ride</Link>
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