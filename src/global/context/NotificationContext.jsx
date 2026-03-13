import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const NotificationContext = createContext(null);

const defaultDuration = 5000;

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const audioContextRef = useRef(null);

  const playNotificationSound = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioCtx = window.AudioContext ;
    if (!AudioCtx) {
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const context = audioContextRef.current;
      if (context.state === "suspended") {
        context.resume().catch(() => {});
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(880, context.currentTime);
      gainNode.gain.setValueAtTime(0.18, context.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);
    } catch (err) {
      console.warn("No se pudo reproducir el sonido de notificación", err);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushNotification = useCallback((payload) => {
    const { message, title = "", type = "info", duration = defaultDuration } = payload || {};
    if (!message) {
      return null;
    }

    const id = createId();
    const notification = {
      id,
      title,
      message,
      type,
      duration,
    };

    setNotifications((prev) => [...prev, notification]);
    setHasUnread(true);
    playNotificationSound();

    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, [playNotificationSound, removeNotification]);

  const acknowledgeNotifications = useCallback(() => {
    setHasUnread(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications,
      hasUnread,
      pushNotification,
      removeNotification,
      acknowledgeNotifications,
    }),
    [notifications, hasUnread, pushNotification, removeNotification, acknowledgeNotifications]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationCenter debe usarse dentro de NotificationProvider");
  }
  return context;
};

export const useNotificationCenter = useNotificationContext;
