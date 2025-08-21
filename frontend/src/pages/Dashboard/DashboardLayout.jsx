import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

// Content pages
import DashboardHome from "./DashboardHome";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import AddDoctor from "./AddDoctor";
import AddPrescription from "./AddPrescription";
import Users from "./Users";
import PatientHistory from "./PatientHistory";
import DoctorDetails from "./DoctorDetail";
import DoctorAppointments from "./DoctorAppointments";
import DoctorProfile from "./DoctorProfile";
import PatientHistoryForAdmin from "./PatientHistoryForAdmin";

export default function AdminLayout() {
  const [active, setActive] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const user = useSelector((state) => state.dasuser.user);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user?.role === "admin") setActive("Dashboard");
    else if (user?.role === "doctor") setActive("DoctorProfile");
  }, [user]);

  const renderContent = () => {
    if (!user) return <h3 className="text-center">Access Denied</h3>;

    switch (active) {
      // ----- Admin Only -----
      case "Dashboard":
        return user.role === "admin" ? (
          <DashboardHome setActive={setActive} />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );
      case "Doctors":
        return user.role === "admin" ? (
          <Doctors setActive={setActive} setSelectedDoctor={setSelectedDoctor} />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );
      case "DoctorDetails":
        return user.role === "admin" ? (
          <DoctorDetails selectedDoctorId={selectedDoctor} setActive={setActive} />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );
      case "PatientHistoryForAdmin":
        return user.role === "admin" ? (
          <PatientHistoryForAdmin
            selectedPatientId={selectedPatientId}
            setActive={setActive}
          />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );
      case "AdminAppointments":
        return user.role === "admin" ? (
          <Appointments setActive={setActive} setSelectedPatientId={setSelectedPatientId} />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );
      case "AddDoctor":
        return user.role === "admin" ? <AddDoctor /> : <h3 className="text-center">Access Denied</h3>;
      case "Users":
        return user.role === "admin" ? <Users /> : <h3 className="text-center">Access Denied</h3>;

      // ----- Doctor & Admin -----
      case "DoctorAppointments":
        return user.role === "doctor" ? (
          <DoctorAppointments
            setActive={setActive}
            setSelectedPatientId={setSelectedPatientId}
            setSelectedAppointmentId={setSelectedAppointmentId}
          />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );
      case "AddPrescription":
        return user.role === "doctor" ? (
          <AddPrescription appointmentId={selectedAppointmentId} />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );
      case "DoctorProfile":
        return user.role === "doctor" ? <DoctorProfile /> : <h3 className="text-center">Access Denied</h3>;
      case "PatientHistory":
        return user.role === "doctor" ? (
          <PatientHistory patientId={selectedPatientId} setActive={setActive} />
        ) : (
          <h3 className="text-center">Access Denied</h3>
        );

      default:
        if (user.role === "admin") {
          setActive("Dashboard");
          return <DashboardHome setActive={setActive} />;
        } else if (user.role === "doctor") {
          setActive("DoctorProfile");
          return <DoctorProfile />;
        }
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        active={active}
        setActive={setActive}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? (sidebarOpen ? "250px" : "0") : "250px",
          paddingTop: isMobile ? "60px" : "0",
          transition: "margin-left 0.3s ease-in-out",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        <div style={{ padding: "30px" }}>{renderContent()}</div>
      </div>
    </div>
  );
}
