import { FiAlignJustify } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import { Logo, Button } from "../common";
import { useNotificationContext } from "../../context/NotificationContext";
import iconoMetro from "../../assets/img/imgs/iconoMetro1.png";

export const HomeHeader = () => {
  const { hasUnread, acknowledgeNotifications } = useNotificationContext();

  return (
    <header className="home-header">
      <Button className="icon-btn">
        <FiAlignJustify />
      </Button>

      <div className="home-logo">
        <Logo logo={iconoMetro} />
        <p>Bogotá sin límites</p>
      </div>

      <Button
        className="icon-btn notification"
        aria-label="Ver notificaciones"
        onClick={acknowledgeNotifications}
      >
        <BsBell />
        {hasUnread ? <span className="notification-dot" aria-hidden="true"></span> : null}
      </Button>
    </header>
  );
};
