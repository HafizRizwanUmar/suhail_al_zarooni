import React from "react";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        {/* Column 1: Brand & Description */}
        <div className="footer-column">
          <h2 className="footer-title">Suhail Al Zarooni</h2>
          <p className="footer-description">
            A global philanthropist, businessman, and Guinness World Record holder.
            Dedicated to humanitarian causes, cultural preservation, and excellence across his various foundations and world-renowned collections.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/foundation">Foundation</a></li>
            <li><a href="/museum">Museum</a></li>
            <li><a href="/collection">Collection</a></li>
          </ul>
        </div>

        {/* Column 3: Follow Us & Signature */}
        <div className="footer-column">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-socials">
            <a href="#twitter" className="social-icon">
              <img src="/3.png" alt="Twitter" />
            </a>
            <a href="#youtube" className="social-icon">
              <img src="/4.png" alt="YouTube" />
            </a>
            <a href="#whatsapp" className="social-icon">
              <img src="/5.png" alt="WhatsApp" />
            </a>
            <a href="#instagram" className="social-icon">
              <img src="/6.png" alt="Instagram" />
            </a>
          </div>
          {/* Signature / Calligraphy placeholder */}
          <div className="footer-signature-container">
            <img src="/logo.png" alt="Signature" className="footer-signature" />
          </div>
        </div>
      </div>

      {/* Footer Bottom Row */}
      <div className="footer-bottom">
        <p>©2024</p>
        <p>Copy Right Reserved</p>
        <p>Leopard Leads IT Solutions</p>
      </div>
    </footer>
  );
};

export default Footer;
