import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useSelector, useDispatch } from "react-redux";

import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";
import { logoutUser } from "../states/UserStates";

export default function StartupNavbar() {
  const [scroll, setScroll] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hoverItem, setHoverItem] = useState("");
  const [isSidebarEnabled] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.dasuser.user); // <-- Get logged in user

  const toggleMenu = () => setIsMenu(!isMenu);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async (isMobile = false) => {
    try {
      await logoutUser(dispatch);
      if (isMobile) setIsMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const hoverStyle = (name) => ({
    color: hoverItem === name ? "#1f3bb3" : "#2a52c3",
    transition: "color 0.2s ease-in-out",
    cursor: "pointer",
  });

  return (
    <>
      <header
        id="topnav"
        className={`${scroll ? "nav-sticky" : ""} defaultscroll sticky bg-white`}
      >
        <div className="container">
          {/* Logo */}
          <Link className="logo" to="/">
            <img src={logoDark} className="logo-light-mode" alt="" />
            <img src={logoLight} className="logo-dark-mode" alt="" />
          </Link>

          {/* Toggle for small screens */}
          <div className="menu-extras">
            <div className="menu-item">
              <Link
                to="#"
                className={`navbar-toggle ${isMenu ? "open" : ""}`}
                onClick={toggleMenu}
              >
                <div className="lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div id="navigation" style={{ display: isMenu ? "block" : "none" }}>
            <ul className="navigation-menu nav-right" id="navmenu-nav">
              {/* Normal menu items */}
              <li className="has-submenu">
                <Link
                  to="/"
                  className="sub-menu-item"
                  style={hoverStyle("home")}
                  onMouseEnter={() => setHoverItem("home")}
                  onMouseLeave={() => setHoverItem("")}
                >
                  Home
                </Link>
              </li>
              <li className="has-submenu">
                <Link
                  to="/aboutus"
                  className="sub-menu-item"
                  style={hoverStyle("about")}
                  onMouseEnter={() => setHoverItem("about")}
                  onMouseLeave={() => setHoverItem("")}
                >
                  About Us
                </Link>
              </li>
              <li className="has-submenu">
                <Link
                  to="/team"
                  className="sub-menu-item"
                  style={hoverStyle("team")}
                  onMouseEnter={() => setHoverItem("team")}
                  onMouseLeave={() => setHoverItem("")}
                >
                  Team
                </Link>
              </li>
              <li className="has-submenu">
                <Link
                  to="/blogs"
                  className="sub-menu-item"
                  style={hoverStyle("blogs")}
                  onMouseEnter={() => setHoverItem("blogs")}
                  onMouseLeave={() => setHoverItem("")}
                >
                  Blog
                </Link>
              </li>
              <li className="has-submenu">
                <Link
                  to="/contactus"
                  className="sub-menu-item"
                  style={hoverStyle("contact")}
                  onMouseEnter={() => setHoverItem("contact")}
                  onMouseLeave={() => setHoverItem("")}
                >
                  Contact
                </Link>
              </li>

              <Link to="/bookappointment">
                <li className="has-submenu">
                  <button
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#2a52c3",
                      color: "white",
                      borderRadius: "9999px",
                      marginTop: "0.9rem",
                      lineHeight: "37px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1f3bb3")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#2a52c3")
                    }
                  >
                    Book Appointment
                  </button>
                </li>
              </Link>

              {/* Small screen items (only when logged in) */}
              {isMenu && user && (
                <>
                  <hr />
                  <li className="has-submenu">
                    <Link to="/bookappointment" className="sub-menu-item">
                      My Appointments
                    </Link>
                  </li>
                  {(user.role === "admin" || user.role === "doctor") && (
                    <li className="has-submenu">
                      <Link to="/dashboard" className="sub-menu-item">
                        Dashboard
                      </Link>
                    </li>
                  )}
                  {(user.role === "patient" || user.role === "admin") && (
                    <li className="has-submenu">
                      <Link to="/profile" className="sub-menu-item">
                        Profile
                      </Link>
                    </li>
                  )}
                  <li className="has-submenu">
                    <button
                      onClick={() => handleLogout(true)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        color: "#2a52c3",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        cursor: "pointer",
                      }}
                      className="sub-menu-item"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

              {/* Sidebar toggle only visible on large screens (only when logged in) */}
              {isSidebarEnabled && user && (
                <li
                  className="has-submenu d-none d-lg-block"
                  style={{
                    marginTop: "0.3rem",
                    marginLeft: "5rem",
                  }}
                >
                  <Link
                    to="#"
                    onClick={toggleSidebar}
                    className={`navbar-toggle ${showSidebar ? "open" : ""}`}
                    style={{
                      padding: 0,
                      margin: 0,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="lines"
                      style={{
                        margin: 0,
                        transform: "scale(0.85)",
                      }}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>

      {/* Sidebar Offcanvas (only when logged in) */}
      {user && (
        <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Doctor Appointment System</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ul
              className="list-unstyled"
              style={{ padding: 0, margin: 0, fontSize: "1.1rem" }}
            >
              <li style={itemStyle}>
                <Link to="/bookappointment" onClick={toggleSidebar}>
                  My Appointments
                </Link>
              </li>
              <hr />
              <li style={itemStyle}>
                <Link to="/bookappointment" onClick={toggleSidebar}>
                  Book Appointment
                </Link>
              </li>
              {(user.role === "admin" || user.role === "doctor") && (
                <>
                  <hr />
                  <li style={itemStyle}>
                    <Link to="/dashboard" onClick={toggleSidebar}>
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
              {(user.role === "patient" || user.role === "admin") && (
                <>
                  <hr />
                  <li style={itemStyle}>
                    <Link to="/profile" onClick={toggleSidebar}>
                      Profile
                    </Link>
                  </li>
                </>
              )}
              <hr />
              <li style={itemStyle}>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleSidebar();
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: "#2a52c3",
                    fontSize: "1.1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "color 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#1f3bb3")}
                  onMouseLeave={(e) => (e.target.style.color = "#2a52c3")}
                  className="sub-menu-item"
                >
                  Logout
                </button>
              </li>
            </ul>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
}

const itemStyle = {
  padding: "10px 0",
  fontWeight: "500",
};
