import { useAuth } from "../../global/context";
import {
  MdDirectionsSubway,
  MdDomain,
  MdLogout,
  MdMergeType,
  MdReportProblem,
  MdRailwayAlert,
} from "react-icons/md";

export const OperadorSidebar = ({
  activeSection,
  onSectionChange,
  isOpen,
  onClose,
}) => {
  const { logout, user } = useAuth();

  const navItems = [
    {
      section: "operacion",
      title: "Operación",
      items: [
        {
          id: "lineas",
          icon: <MdDirectionsSubway />,
          label: "Líneas",
          badge: null,
        },
        {
          id: "estaciones",
          icon: <MdDomain />,
          label: "Estaciones",
          badge: null,
        },
        {
          id: "estaciones-lineas",
          icon: <MdMergeType />,
          label: "Asignaciones",
          badge: null,
        },
        {
          id: "interrupciones",
          icon: <MdReportProblem />,
          label: "Interrupciones",
          badge: null,
        },
      ],
    },
  ];

  const handleNavClick = (itemId) => {
    onSectionChange(itemId);
    if (onClose) onClose();
  };

  const getUserInitials = () => {
    if (!user?.nombre) return "OP";
    return user.nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <MdRailwayAlert />
          </div>
          <div>
            <div className="sidebar-title">Bogotá Metro</div>
            <div className="sidebar-subtitle">Panel Operador</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-info">
              <div className="user-name">{user?.nombre || "Operador"}</div>
              <div className="user-role">Operador</div>
            </div>
          </div>

          <div className="nav-item logout-btn" onClick={logout}>
            <span className="nav-item-icon">
              <MdLogout />
            </span>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OperadorSidebar;