
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChevronLeft, FaUserCircle, FaCreditCard, 
  FaClock, FaGlobe, FaBell, FaRegClock, FaSun, FaCheck 
} from 'react-icons/fa';
import './personalizacion.css';

const Configuracion = () => {
  const navigate = useNavigate();
  const [idioma, setIdioma] = useState('Español');
  const [showIdiomaModal, setShowIdiomaModal] = useState(false);

  const idiomas = ['Español', 'English', 'Français', 'Português'];

  // Dentro de Configuracion.jsx, actualiza la función handleAction
const handleAction = (item) => {
  if (item.label === 'Idioma') {
    setShowIdiomaModal(true);
  } else if (item.label === 'Alarma') {
    // ESTA ES LA UNIÓN: Navega y avisa que queremos ver la alarma programada
    navigate('/notificaciones', { state: { irAAlarmaProgramada: true } });
  } else if (item.link) {
    navigate(item.link);
  }
};

  const opcionesCuenta = [
    { id: 1, label: 'Perfil', icon: <FaUserCircle />, link: '/perfil' },
    { id: 2, label: 'Metodo de pago', icon: <FaCreditCard />, link: '/pagos' },
    { id: 3, label: 'Historial de viaje', icon: <FaClock />, link: '/historial' },
  ];

  const opcionesPreferencias = [
    { id: 4, label: 'Idioma', icon: <FaGlobe /> }, 
    { id: 5, label: 'Notificacion', icon: <FaBell />, link: '/notificaciones' },
    { id: 6, label: 'Alarma', icon: <FaRegClock />, link: '/alarmas' },
    { id: 7, label: 'Preferencia de pantalla', icon: <FaSun />, link: '/accesibilidad' },
  ];

  return (
    <div className="mobile-container config-bg">
      <div className="app-screen">
        <header className="header-red">
          <FaChevronLeft className="icon-back" onClick={() => navigate(-1)} />
          <h1 className="header-title-adapta">configuración de Inicio</h1>
        </header>

        {/* Contenedor con scroll para las opciones */}
        <div className="app-content-scrollable">
          <section className="config-section">
            <h2 className="section-subtitle">cuenta</h2>
            {opcionesCuenta.map((item) => (
              <div key={item.id} className="config-item">
                <span className="item-icon-red">{item.icon}</span>
                <button className="btn-config-white" onClick={() => handleAction(item)}>
                  {item.label}
                </button>
              </div>
            ))}
          </section>

          <section className="config-section">
            <h2 className="section-subtitle">Preferencias</h2>
            {opcionesPreferencias.map((item) => (
              <div key={item.id} className="config-item">
                <span className="item-icon-red">{item.icon}</span>
                <button className="btn-config-white" onClick={() => handleAction(item)}>
                  {item.label === 'Idioma' ? `Idioma: ${idioma}` : item.label}
                </button>
              </div>
            ))}
          </section>
        </div>

        {/* Botón Aplicar FIJO abajo para que siempre se vea */}
        <div className="footer-fixed">
          <button className="btn-aplicar-red" onClick={() => navigate('/home')}>
            Aplicar Ajustes
          </button>
        </div>

        {showIdiomaModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="section-subtitle" style={{textAlign: 'center'}}>Selecciona un Idioma</h3>
              {idiomas.map((lang) => (
                <div 
                  key={lang} 
                  className={`modal-option ${idioma === lang ? 'selected' : ''}`}
                  onClick={() => { setIdioma(lang); setShowIdiomaModal(false); }}
                >
                  {lang} {idioma === lang && <FaCheck />}
                </div>
              ))}
              <button className="btn-close-modal" onClick={() => setShowIdiomaModal(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracion;