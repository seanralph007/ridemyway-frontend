import React from "react";
import "./Footer.css";
import { year } from "../../utils/formatters";

function Footer() {
  // const date = year;
  return (
    <footer className="footer-container">
      <p className="footer-text">Built and Designed by Kingsley Okoro</p>
      <p className="footer-text">ⓒ {year}</p>
    </footer>
  );
}

export default Footer;
