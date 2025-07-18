import React from "react";
import "./Footer.css";

function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer className="footer-container">
        <p className="footer-text">Designed and built by Chukwudi Kingsley Okoro</p>
        <p className="footer-text">Copyright ⓒ {year}</p>
      </footer>
    );
}
  
export default Footer;