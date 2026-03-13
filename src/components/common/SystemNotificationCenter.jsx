import { createPortal } from "react-dom";
import { useNotificationContext } from "../../global/context/NotificationContext";
import "../../assets/styles/notification.css";

export const SystemNotificationCenter = () => {
  const { notifications, removeNotification } = useNotificationContext();

  if (typeof document === "undefined") {
    return null;
  }

  if (!notifications.length) {
    return null;
  }

  return createPortal(
    <div className="system-notification-container" role="region" aria-live="assertive">
      {notifications.map((notification) => {
        const { id, title, message, type } = notification;
        const variant = type || "info";

        return (
          <div
            key={id}
            className={`system-notification system-notification--${variant}`}
            role="status"
          >
            {title ? <h4>{title}</h4> : null}
            <p>{message}</p>
            <button
              type="button"
              aria-label="Cerrar notificación"
              onClick={() => removeNotification(id)}
            >
              X
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
};
