import { useNavigate } from 'react-router-dom';
import React from 'react';
import './personalizacion.css';
import { FaChevronLeft } from 'react-icons/fa';

const AdactaTuExperiencia = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mobile-container">
      <div className="app-screen">
        <header className="header-red">
          <FaChevronLeft className="icon-back" />
          <h1 className="header-title-adapta">Adapta tu Experiencia</h1>
        </header>

        <div className="app-content-adapta">
          <div className="metro-logo-solo"></div>

          <p className="description-text-high">
            ¡Haz que Metro App sea realmente tuya! Aquí puedes ajustar la aplicación para que se adapte perfectamente a tu estilo y tus necesidades.
          </p>

          <div className="config-icons-row">
            {/*  Conexión con la ruta de Accesibilidad */}
            <button 
              className="icon-item-btn" 
              onClick={() => navigate('/accesibilidad')}
            >
              <div className="icon-red-box">
                <img src="/src/assets/imagenes de fondo/icono accesiblidad.png" alt="Acc" className="btn-icon-img" />
              </div>
              <span>Accesibilidad</span>
            </button>

            {/* Botón Configuración */}
            <button className="icon-item-btn" onClick={() => navigate('/configuracion')}>
              <div className="icon-red-box">
                <img src="/src/assets/imagenes de fondo/icono configuracion.png" alt="Conf" className="btn-icon-img" />
              </div>
              <span>configuración</span>
            </button>

            {/* Botón Notificaciones */}
            <button 
              className="icon-item-btn" 
              onClick={() => navigate('/notificaciones')}
            >
              <div className="icon-red-box">
                <img src="/src/assets/imagenes de fondo/icono de notificacion.png" alt="Alerta" className="btn-icon-img" />
              </div>
              <span>Notificaciones </span>
            </button>
          </div>

          <button className="btn-aplicar-red">Aplicar Ajustes</button>
        </div>
      </div>
    </div>
  );
};

export default AdactaTuExperiencia;
