import { useAuth } from "../../context/AuthUserContext";
import {
  MdChat,
  MdCreditCard,
  MdDirectionsSubway,
  MdLogout,
  MdHeadsetMic,
  MdReceipt,
} from "react-icons/md";

/**
 * Sidebar del dashboard de soporte.
 * Estructura modular por secciones, extensible para nuevos módulos.
 */
export const SoporteSidebar = ({
  activeSection,
  onSectionChange,
  isOpen,
  onClose,
}) => {
  const { logout, user } = useAuth();

  const navItems = [
    {
      section: "main",
      title: "Principal",
      items: [
        {
          id: "chat",
          icon: <MdChat />,
          label: "Chat de Soporte",
          badge: null,
        },
      ],
    },
    {
      section: "transacciones",
      title: "Transacciones Pasajeros",
      items: [
        {
          id: "recargas",
          icon: <MdCreditCard />,
          label: "Recargas",
          badge: null,
        },
        {
          id: "pagos-metro",
          icon: <MdDirectionsSubway />,
          label: "Pagos al Metro",
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
    if (!user?.nombre) return "SP";
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
            <MdHeadsetMic />
          </div>
          <div>
            <div className="sidebar-title">Bogotá Metro</div>
            <div className="sidebar-subtitle">Panel Soporte</div>
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
                  {item.badge && (
                    <span className="nav-item-badge">{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-info">
              <div className="user-name">
                {user?.nombre || "Soporte"}
              </div>
              <div className="user-role">Agente de Soporte</div>
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
