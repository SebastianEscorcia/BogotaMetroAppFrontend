import { useState, useRef, useEffect } from "react";
import { FiAlignJustify } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import {
  MdCheckCircle,
  MdDeleteSweep,
  MdDoneAll,
  MdClose,
  MdAccountBalanceWallet,
  MdInfo,
  MdWarning,
  MdSyncAlt,
  MdError,
} from "react-icons/md";
import { Logo, Button } from "../common";
import {useNotificationContext,useWebSocketNotifications} from '../../global/context';
import iconoMetro from "../../assets/img/imgs/iconoMetro1.png";

import "./homeHeader.css";

const ICON_MAP = {
  RECARGA_EXITOSA: <MdAccountBalanceWallet />,
  RECARGA: <MdAccountBalanceWallet />,
  SALDO_ENVIADO: <MdSyncAlt />,
  SALDO_RECIBIDO: <MdSyncAlt />,
  SOLUCIONAR: <MdCheckCircle />,
  INTERRUPCION: <MdWarning />,
  FALLA_TECNICA: <MdWarning />,
  ACCIDENTE: <MdWarning />,
  MANTENIMIENTO: <MdWarning />,
  EVENTO_CLIMATICO: <MdWarning />,
  OTRO: <MdWarning />,
  SUCCESS: <MdCheckCircle />,
  WARNING: <MdWarning />,
  ERROR: <MdError />,
  info: <MdInfo />,
};

const formatTimeAgo = (fechaISO) => {
  if (!fechaISO) return "";
  const diff = Date.now() - new Date(fechaISO).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
};

export const HomeHeader = () => {
  const { acknowledgeNotifications } = useNotificationContext();
  const {
    notificaciones,
    noLeidas,
    marcarLeida,
    marcarTodasLeidas,
    limpiarHistorial,
    
  } = useWebSocketNotifications();

  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    if (panelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  const togglePanel = () => {
    setPanelOpen((prev) => !prev);
    if (!panelOpen) {
      acknowledgeNotifications();
    }
  };

  return (
    <header className="home-header">
      <Button className="icon-btn">
        <FiAlignJustify />
      </Button>

      <div className="home-logo">
        <Logo logo={iconoMetro} />
        <p>Bogotá sin límites</p>
      </div>

      <div className="notif-wrapper" ref={panelRef}>
        <Button
          className="icon-btn notification"
          aria-label="Ver notificaciones"
          onClick={togglePanel}
        >
          <BsBell />
          {noLeidas > 0 && (
            <span className="notification-badge" aria-hidden="true">
              {noLeidas > 9 ? "9+" : noLeidas}
            </span>
          )}
        </Button>

        {/* ─── PANEL DE NOTIFICACIONES ─── */}
        {panelOpen && (
          <div className="notif-panel">
            <div className="notif-panel-header">
              <h4>Notificaciones</h4>
              <div className="notif-panel-actions">
                {noLeidas > 0 && (
                  <button
                    className="notif-action-btn"
                    title="Marcar todas como leídas"
                    onClick={marcarTodasLeidas}
                  >
                    <MdDoneAll />
                  </button>
                )}
                {notificaciones.length > 0 && (
                  <button
                    className="notif-action-btn"
                    title="Limpiar historial"
                    onClick={limpiarHistorial}
                  >
                    <MdDeleteSweep />
                  </button>
                )}
                <button
                  className="notif-action-btn"
                  title="Cerrar"
                  onClick={() => setPanelOpen(false)}
                >
                  <MdClose />
                </button>
              </div>
            </div>

            <div className="notif-panel-body">
              {notificaciones.length === 0 ? (
                <div className="notif-empty">
                  <BsBell className="notif-empty-icon" />
                  <p>Sin notificaciones</p>
                </div>
              ) : (
                notificaciones.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.leida ? "leida" : "no-leida"} tipo-${(
                      n.tipo || "info"
                    ).toLowerCase()}`}
                    onClick={() => marcarLeida(n.id)}
                  >
                    <div className="notif-item-icon">
                      {ICON_MAP[n.tipo] || ICON_MAP.info}
                    </div>
                    <div className="notif-item-content">
                      <span className="notif-item-titulo">{n.titulo}</span>
                      <p className="notif-item-mensaje">{n.mensaje}</p>
                      <span className="notif-item-fecha">
                        {formatTimeAgo(n.fecha)}
                      </span>
                    </div>
                    {!n.leida && <span className="notif-unread-dot" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
