import { 
  MdHome, 
  MdSearch, 
  MdNotifications, 
  MdMail, 
  MdHelpOutline,
  MdMenu 
} from "react-icons/md";

export const DashboardHeader = ({ title, breadcrumb = [], onMenuToggle }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <MdMenu />
        </button>
        <div className="header-breadcrumb">
          <span className="breadcrumb-icon"><MdHome /></span>
          {breadcrumb.map((item, index) => (
            <span key={index}>
              <span className="breadcrumb-separator">/</span>
              <span className={index === breadcrumb.length - 1 ? "breadcrumb-current" : ""}>
                {item}
              </span>
            </span>
          ))}
        </div>
        <div className="header-search">
          <span className="search-icon"><MdSearch /></span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" title="Notificaciones">
          <MdNotifications />
          <span className="notification-dot"></span>
        </button>
        <button className="header-btn" title="Mensajes">
          <MdMail />
        </button>
        <button className="header-btn" title="Ayuda">
          <MdHelpOutline />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
