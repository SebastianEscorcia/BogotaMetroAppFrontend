import { 
  MdSecurity, 
  MdCheckCircle, 
  MdWarning, 
  MdAccessTime,
  MdTrendingUp,
  MdTrendingDown 
} from "react-icons/md";

export const StatsCards = ({ stats }) => {
  const cardsData = [
    {
      title: "Total Roles",
      value: stats.total,
      change: "+12%",
      changeType: "positive",
      icon: <MdSecurity />,
      iconType: "primary",
    },
    {
      title: "Roles Activos",
      value: stats.active,
      change: "100%",
      changeType: "positive",
      icon: <MdCheckCircle />,
      iconType: "success",
    },
    {
      title: "Roles Inactivos",
      value: stats.inactive,
      change: "0%",
      changeType: "negative",
      icon: <MdWarning />,
      iconType: "warning",
    },
    {
      title: "Última Actualización",
      value: "Hoy",
      change: "Hace 2 min",
      changeType: "positive",
      icon: <MdAccessTime />,
      iconType: "danger",
    },
  ];

  return (
    <div className="stats-grid">
      {cardsData.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-info">
            <h3>{card.title}</h3>
            <div className="stat-value">{card.value}</div>
            <div className={`stat-change ${card.changeType}`}>
              <span>{card.changeType === "positive" ? <MdTrendingUp /> : <MdTrendingDown />}</span>
              <span>{card.change}</span>
            </div>
          </div>
          <div className={`stat-icon-wrapper ${card.iconType}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
