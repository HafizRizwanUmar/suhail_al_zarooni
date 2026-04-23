import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import '../../styles/NavBar.css';
import SubscriptionModal from "../Shared/SubscriptionModal";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("https://suhail-al-zarooni-backend.vercel.app/api/notifications");
        setNotifications(res.data.data);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Close drawer on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Close drawer on outside click (handled via overlay)
  const isActive = (path) =>
    location.pathname === path
      ? "navbar-links-active nav-link"
      : "nav-link";


  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/events", label: "Events" },
    { path: "/foundation", label: "Foundation" },
    { path: "/museum", label: "Museum" },
    { path: "/media", label: "Media" },
    { path: "/collection", label: "Collection" },
    { path: "/meetup", label: "Meetup" },
    { path: "/contributors", label: "Contributors" },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`menu-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={closeMenu}
      />

      <nav className="navbar">
        {/* LEFT: Logo */}
        <div className="navbar-left">
          <Link to="/home" onClick={closeMenu}>
            <img src="/logo.png" alt="Logo" className="logo" />
          </Link>
        </div>

        {/* MIDDLE: Title + Nav Links */}
        <div className="navbar-middle">
          <div className="navbar-title">Suhail Mohammad Al Zarooni</div>
          <div
            className={`navbar-links ${isMenuOpen ? "open" : ""}`}
            ref={drawerRef}
          >
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={isActive(path)}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT: Hamburger + Subscribe + Bell + Profile */}
        <div className="navbar-right">
          <span className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? "\u2715" : "\u2630"}
          </span>

          <button className="subscribe-button" onClick={() => setShowSubscriptionModal(true)}>
            SUBSCRIBE
          </button>

          <div className="notification-wrapper" ref={notificationRef} style={{ position: 'relative' }}>
            <span 
              className="notification-icon" 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: 'pointer' }}
            >
              <img src="/notification-bell.png" alt="Notifications" />
              {notifications.some(n => !n.isRead) && <span className="notification-badge"></span>}
            </span>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">Latest Updates</div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <Link to={n.link} key={n._id} className="notification-item">
                        <div className="notification-message">{n.message}</div>
                        <div className="notification-time">{new Date(n.createdAt).toLocaleDateString()}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="notification-empty">No notifications yet</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/adminlogin" className="profile-icon" title="Login / Dashboard">
            <img src="/profile_icon.png" alt="Profile" className="nav-profile-img" />
          </Link>
        </div>
      </nav>

      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />
    </>
  );
};

export default Navbar;
