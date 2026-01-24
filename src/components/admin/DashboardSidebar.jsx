import { useAuth } from "../../context/AuthUserContext";
import { 
  MdDashboard, 
  MdSecurity, 
  MdPeople, 
  MdBuild, 
  MdHeadsetMic, 
  MdBarChart, 
  MdSettings, 
  MdLogout 
} from "react-icons/md";

export const DashboardSidebar = ({ activeSection, onSectionChange, isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    {
      section: "main",
      title: "Principal",
      items: [
        { id: "dashboard", icon: <MdDashboard />, label: "Dashboard", badge: null },
        { id: "roles", icon: <MdSecurity />, label: "Gestión de Roles", badge: null },
      ],
    },
    {
      section: "users",
      title: "Usuarios",
      items: [
        { id: "passengers", icon: <MdPeople />, label: "Pasajeros", badge: null },
        { id: "operators", icon: <MdBuild />, label: "Operadores", badge: null },
        { id: "support", icon: <MdHeadsetMic />, label: "Soporte", badge: null },
      ],
    },
    {
      section: "system",
      title: "Sistema",
      items: [
        { id: "reports", icon: <MdBarChart />, label: "Reportes", badge: null },
        { id: "settings", icon: <MdSettings />, label: "Configuración", badge: null },
      ],
    },
  ];

  const handleNavClick = (itemId) => {
    onSectionChange(itemId);
    if (onClose) onClose();
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} 
        onClick={onClose}
      />
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">BM</div>
          <div>
            <div className="sidebar-title">Bogotá Metro</div>
            <div className="sidebar-subtitle">Panel Admin</div>
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
                  {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Administrador</div>
              <div className="user-role">Super Admin</div>
            </div>
          </div>
          <div
            className="nav-item logout-btn"
            onClick={logout}
          >
            <span className="nav-item-icon"><MdLogout /></span>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
