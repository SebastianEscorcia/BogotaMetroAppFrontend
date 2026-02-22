
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Viaje.css';

export default function DetalleLinea() {
  const { id } = useParams(); // Esto captura el número del botón (1, 2, 3...)
  const navigate = useNavigate();

  return (
    <div className="app-screen">
      <header className="header-red">
        <button className="back-btn" onClick={() => navigate(-1)}>{'<'}</button>
        <h1 className="title-center">LÍNEA {id}</h1>
      </header>
      <main className="main-content">
        <h2>Estaciones de la Línea {id}</h2>
        {/* Aquí  esta el  switch o un array para mostrar las estaciones reales según el id */}
        <p>Mostrando estaciones para la Línea {id}</p>
      </main>
    </div>
  );
}