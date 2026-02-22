
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaVolumeUp, FaStar } from 'react-icons/fa';
import './personalizacion.css'; 

const Accesibilidad = () => {
  const navigate = useNavigate();
  const [tema, setTema] = useState('oscuro');
  const [rating, setRating] = useState(0);

  const activarGuiaVoz = () => {
    const mensaje = new SpeechSynthesisUtterance("Guía de voz activada");
    mensaje.lang = 'es-ES';
    window.speechSynthesis.speak(mensaje);
  };

  return (
    <div className={`mobile-container ${tema}-mode`}>
      <div className="app-screen">
        <header className="header-red">
          <FaChevronLeft 
            className="icon-back" 
            onClick={() => navigate('/personalizacion')} 
          />
          <h1 className="header-title-adapta">Accesibilidad</h1>
        </header>

        <div className="app-content-adapta">
          <div className="metro-logo-solo"></div>

          <div className="accessibility-options">
            
            {/* Sección: Modo de Visualización */}
            <h3 className="section-title-custom">Modo de Visualización</h3>
            <div className="theme-selection-row">
              <button 
                className={`btn-theme-slim ${tema === 'claro' ? 'active' : ''}`}
                onClick={() => setTema('claro')}
              >
                Modo Claro
              </button>
              <button 
                className={`btn-theme-slim ${tema === 'oscuro' ? 'active' : ''}`}
                onClick={() => setTema('oscuro')}
              >
                Modo Oscuro
              </button>
            </div>

            {/* Sección: Ayudas Especiales */}
            <h3 className="section-title-custom">Ayudas Especiales</h3>
            <div className="voice-guide-container">
              <button className="btn-guia-voz-small" onClick={activarGuiaVoz}>
                <FaVolumeUp size={14} />
                <span>Activar Guía de Voz</span>
              </button>
            </div>

            {/* Sección: Calificación (Subida) */}
            <div className="rating-container">
              <h3 className="section-title-custom rating-title">Califica tu experiencia</h3>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star-icon ${rating >= star ? 'star-active' : ''}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              {rating > 0 && (
                <p className="rating-text">
                  ¡Gracias por calificar con {rating} estrellas!
                </p>
              )}
            </div>
          </div>

          <button className="btn-aplicar-red" onClick={() => navigate('/personalizacion')}>
            Aplicar ajustes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accesibilidad;