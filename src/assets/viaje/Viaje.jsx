
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Viaje.css';

export default function Viaje() {
  const navigate = useNavigate();
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');

  const guardarViaje = (tipo) => {
    if (!origen || !destino) return alert("Selecciona origen y destino");
    const nuevoViaje = { origen, destino, tipo };
    const guardados = JSON.parse(localStorage.getItem('viajes') || '[]');
    localStorage.setItem('viajes', JSON.stringify([...guardados, nuevoViaje]));
    alert(`${tipo} guardado con éxito`);
  };

  return (
    <div className="app-screen">
      <div className="content-wrapper">
        {/* HEADER principal */}
        <header className="header-red">
          <button className="back-btn" onClick={() => navigate(-1)}>{'<'}</button>
          <h1 className="title-center">Viaje</h1>
          <div className="spacer"></div>
        </header>

        <main className="main-content">
          <button className="btn-qr-transparente" onClick={() => navigate('/viajar-con-qr')}>
            Viajar con QR
          </button>

          <div className="card-planificador">
            <div className="input-group">
              <img src="/assets/imagenes de fondo/icono ubicacion.png" alt="origen" />
              <select onChange={(e) => setOrigen(e.target.value)}>
                <option value="">Origen: Estación Banderas</option>
                <option value="Portal Américas">Portal Américas</option>
                <option value="Marsella">Marsella</option>
              </select>
            </div>
            
            <div className="input-group">
              <img src="/assets/imagenes de fondo/icono ubicacion.png" alt="destino" />
              <select onChange={(e) => setDestino(e.target.value)}>
                <option value="">Destino: Calle 72</option>
                <option value="Calle 26">Calle 26</option>
                <option value="Calle 72">Calle 72</option>
              </select>
            </div>
          </div>

          <button className="action-btn" onClick={() => guardarViaje('Guardado')}>Guardar mi viaje</button>
          <button className="action-btn" onClick={() => guardarViaje('Favorito')}>Guardar favoritos</button>
          <button className="delete-btn" onClick={() => localStorage.removeItem('viajes')}>Eliminar viajes</button>
        </main>

        {/* BOTÓN CONTINUAR FIJO ABAJO */}
        <button 
          className="btn-continuar" 
          onClick={() => navigate('/resultado', { state: { origen, destino } })}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}