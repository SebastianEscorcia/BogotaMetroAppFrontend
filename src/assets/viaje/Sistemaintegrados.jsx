
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Viaje.css'; 



export default function SistemaIntegrado() {
  const navigate = useNavigate();

  const sistemas = [
    { name: "Transmilenio", icon: "/assets/imagenes de fondo/icono bus transmilenio.png" },
    { name: "SITP", icon: "/assets/imagenes de fondo/icono SITP.png" },
    { name: "TransMicable", icon: "/assets/imagenes de fondo/icono transmicable.png" },
  ];

  return (
    <div className="app-screen">
      <header className="header-red">
        <button className="back-btn" onClick={() => navigate(-1)}>{'<'}</button>
        <h1 className="title-center">Sistemas Integrados</h1>
        <div className="spacer"></div>
      </header>

      <main className="main-content-integrado"> {/* Clase específica para esta pantalla */}
        {/* Mapa de Referencia */}
        <div className="map-container">
          <img src="/assets/mapa-bogota.png" alt="Mapa de Bogotá" className="map-img" />
          <div className="search-icon">🔍</div>
          <div className="location-icon">📍</div>
        </div>

        {/* Lista de Sistemas de Transporte */}
        <div className="sistemas-list">
          {sistemas.map((sistema, index) => (
            <div key={index} className="sistema-item">
              <div className="sistema-info">
                {/* Asumiendo que los íconos están en public/assets/icons/ */}
                <img src={sistema.icon} alt={sistema.name} className="sistema-icon" />
                <span>{sistema.name}</span>
              </div>
              <div className="arrow-icon">→</div>
            </div>
          ))}
        </div>
      </main>

      <button className="btn-continuar-integrado" onClick={() => navigate('/home')}> {/* Puedes cambiar la ruta de destino */}
        Continuar
      </button>
    </div>
  );
}