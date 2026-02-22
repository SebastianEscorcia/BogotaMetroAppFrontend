
import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './Viaje.css';

export default function ViajarConQR() {
  const navigate = useNavigate();
  const valorQR = "ID-USUARIO-VIAJE-METRO-12345";

  return (
    <div className="app-screen">
      <header className="header-red">
        <button className="back-btn" onClick={() => navigate(-1)}>{'<'}</button>
        <h1 className="title-center">VIAJA CON QR</h1>
        <div className="spacer"></div>
      </header>

      <main className="main-content">
        <div className="logo-container">
          <img src="/assets/imagenes de fondo/bienvenidobogotasinlimites.png" alt="Logo" className="logo-img" />
       </div>

        <div className="text-section">
          <h2>¿Viajas en una de estas líneas?</h2>          
        </div>

        <div className="lineas-container">
          {[1, 2, 3, 4, 5].map((num) => (
            <button 
              key={num} 
              className="linea-btn" 
              onClick={() => navigate(`/linea/${num}`)} // Esto llevará a /linea/1, /linea/2, etc.
            >
              Línea {num}
            </button>
          ))}
        </div>

        <div className="qr-container">
          <QRCode value={valorQR} size={150} level="H" />
        </div>

        <div className="info-box">
          <p>Ten en cuenta que este código <b>No te permite</b> hacer integraciones con otros transportes.</p>
        </div>
      </main>

      <button className="btn-continuar" onClick={() => navigate('/otras-lineas')}>
        ¿Viajas en otras líneas?
      </button>
    </div>
  );
}