import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaBars,
  FaTimes,
  FaUserMd,
  FaCalendarCheck,
  FaPlusCircle,
  FaFilePrescription,
  FaUsers,
  FaTachometerAlt,
  FaHome,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const menuItems = [
  { key: "Dashboard", icon: <FaTachometerAlt />, label: "Dashboard", roles: ["admin"] },
  { key: "Doctors", icon: <FaUserMd />, label: "Doctors", roles: ["admin"] },
  { key: "AdminAppointments", icon: <FaCalendarCheck />, label: "Admin Appointments", roles: ["admin"] },
  { key: "DoctorAppointments", icon: <FaCalendarCheck />, label: "Doctor Appointments", roles: ["doctor"] },
  { key: "AddDoctor", icon: <FaPlusCircle />, label: "Add Doctor", roles: ["admin"] },
  { key: "DoctorProfile", icon: <FaUserMd />, label: "Doctor Profile", roles: ["doctor"] },
  { key: "Users", icon: <FaUsers />, label: "Patients", roles: ["admin"] },
  { key: "Logout", icon: <FaFilePrescription />, label: "Logout", roles: ["admin", "doctor"] },
];

export default function Sidebar({ active, setActive, isOpen, setIsOpen }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const user = useSelector((state) => state.dasuser.user);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#000",
    color: "#fff",
    padding: "20px 0",
    boxSizing: "border-box",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: isOpen ? 0 : "-250px",
    transition: "left 0.3s ease-in-out",
    zIndex: 2000,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  };

  const filteredMenu = user ? menuItems.filter((item) => item.roles.includes(user.role)) : [];

  return (
    <>
      {/* Top bar for mobile */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "60px",
            background: "#ddd",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            justifyContent: "space-between",
            zIndex: 2100,
          }}
        >
          <div
            style={{ fontSize: "24px", cursor: "pointer", color: "#000" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
          <h4 style={{ color: "#000", margin: 0 }}>Admin Dashboard</h4>
        </div>
      )}

      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ marginTop: isMobile ? "60px" : "0" }}>
          <h3 className="text-center mb-4">Admin Panel</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              cursor: "pointer",
              backgroundColor: "#1a1a1a",
              transition: "0.3s",
            }}
          >
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#fff",
                width: "100%",
              }}
            >
              <span style={{ fontSize: "18px", marginRight: "10px" }}>
                <FaHome />
              </span>
              <span>Home</span>
            </Link>
          </div>

          {filteredMenu.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                setActive(item.key);
                if (isMobile) setIsOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                cursor: "pointer",
                backgroundColor: active === item.key ? "#1a1a1a" : "transparent",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  active === item.key ? "#1a1a1a" : "transparent")
              }
            >
              <span style={{ fontSize: "18px", marginRight: "10px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 20px", color: "#bbb", fontSize: "14px" }}>
          ©2025 Admin Dashboard
        </div>
      </div>
    </>
  );
}
