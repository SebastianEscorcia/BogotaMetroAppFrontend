
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Viaje.css';

export default function DetalleLineaUno() {
  const navigate = useNavigate();
  
  const estaciones = [
    "Portal Américas", "Transversal 86", "Biblioteca Tintal", 
    "Patio Bonito", "Tv 86", "Banderas", "Marsella", 
    "Av. Américas", "Calle 26", "Centro"
  ];

  const handleEstacionClick = (nombre) => {
    console.log("Seleccionaste:", nombre);
    // Aquí puedes navegar a otra pantalla o guardar la selección
  };

  return (
    <div className="app-screen">
      <header className="header-red">
        <button className="back-btn" onClick={() => navigate(-1)}>{'<'}</button>
        <h1 className="title-center">Línea 1</h1>
        <div className="spacer"></div>
      </header>

      <main className="main-content">
        <div className="logo-container">
          <img src="/assets/imagenes de fondo/fondo 1.png" alt="Logo" className="logo-img" />
        </div>

        <h2 className="subtitle">Estaciones - Línea 1</h2>
        
        <div className="estaciones-list">
          {estaciones.map((estacion, index) => (
            <button 
              key={index} 
              className="estacion-btn" 
              onClick={() => handleEstacionClick(estacion)}
            >
              {index + 1}. {estacion}
            </button>
          ))}
        </div>
      </main>

      <button className="btn-continuar" onClick={() => navigate('/viajar-con-qr')}>
        Volver al QR
      </button>
    </div>
  );
}