
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Importaciones de las vistas principales
import BogotaMetroApp from './BogotaMetroApp'
import Home from './Home'
import Actualizaciondedatos from './Actualizaciondedatos'

// --- RUTAS DE PERSONALIZACIÓN (AJUSTADAS) ---

import AdactaTuExperiencia from './Personalizacion/AdactaTuExperiencia'; 
import Accesibilidad from './Personalizacion/Accesibilidad'; 
import Configuracion from './Personalizacion/Configuracion'; 
import Notificaciones from './Personalizacion/Notificaciones'; 
import Viaje from './assets/viaje/Viaje';
import ViajarConQR from './assets/viaje/Viajar conqr';
import Detallelinea from './assets/viaje/DetalleLinea';
import Sistemaintegrado from './assets/viaje/Sistemaintegrados';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BogotaMetroApp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/soporte" element={<Actualizaciondedatos />} />

        {/* Módulos de perzonalizacion*/}
        <Route path="/personalizacion" element={<AdactaTuExperiencia />} /> 
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/accesibilidad" element={<Accesibilidad />} /> 
        <Route path="/notificaciones" element={<Notificaciones />} /> 

        {/* Módulos de viaje */}
        <Route path="/viaje" element={<Viaje />} />
        <Route path="/viajar-con-qr" element={<ViajarConQR />} />
        <Route path="/linea/:id" element={<Detallelinea />} />
        <Route path="/otras-lineas" element={<Sistemaintegrado />} /> {/* <-- Nueva Ruta */}

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)