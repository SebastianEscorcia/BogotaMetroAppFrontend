
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, PhoneCall } from 'lucide-react';

// Importación de componentes corregida 
import Registro from './Registro';
import Metroapp from './Metroapp';
import Actualizaciondedatos from './Actualizaciondedatos';
import Recarga from './Recarga';
import Pasarsaldo from './Pasarsaldo';//problemilla//
import Masservicios from './Masservicios';
import Metropay from './Metropay';
import Transporte from './Transporte';
import Tarjetametro from './Tarjetametro';
import Mapa from './Mapa';
import Tarifas from './Tarifas';
import Horarios from './Horarios.jsx';


function Inicio() {
  const navigate = useNavigate();
  
  // Menú con las rutas conectadas
  const menuItems = [
    { label: 'Registro', path: '/registro' },
    { label: 'Recarga', path: '/recarga' },
    { label: 'Metro APP', path: '/metroapp' },
    { label: 'Pasar saldo', path: '/pasarsaldo' },
    { label: 'MetroPay', path: '/metropay' },
    { label: 'Más servicios', path: '/masservicios' },
    { label: 'Transporte', path: '/transporte' },
    { label: 'Tarifas', path: '/tarifas' },
    { label: 'Tarjeta met.', path: '/tarjetametro' },
    { label: 'Horarios', path: '/horarios' },
    { label: 'Mapa', path: '/mapa' },
    { label: 'Actualizar datos', path: '/actualizardatos' },

  ];

  return (
    <div className="relative z-10 flex flex-col h-full">
      <header className="bg-[#E30613] text-white p-6 pt-14 flex items-center shadow-lg">
        <ChevronLeft size={28} className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="flex-1 text-center text-3xl font-extrabold capitalize tracking-tight">
          Soporte técnico
        </h1>
      </header>

      <main className="p-3 flex-1 flex flex-col">
        <h2 className="text-black text-xl font-extrabold mt-4 mb-6 text-center italic capitalize">
          ¿Cómo podemos ayudarte?
        </h2>

        <div className="relative mb-8 group">
          <input 
            type="text" 
            placeholder="Buscar" 
            className="w-full bg-[#E30613] text-white placeholder-white/70 rounded-full py-3.5 px-6 pr-12 outline-none font-extrabold"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white" size={20} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              onClick={() => item.path && navigate(item.path)}
              className="bg-[#E30613] text-white text-[13px] font-extrabold py-4 rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto relative pb-8">
          <button className="w-full bg-[#E30613] text-white font-extrabold py-5 px-6 rounded-2xl text-left flex items-center shadow-xl">
            <PhoneCall className="mr-3" size={24} />
            Llámanos o escríbenos
          </button>
          <div 
            className="absolute -right-2 -top-10 w-27 h-39 bg-contain bg-no-repeat" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
      </main>
    </div>
  );
}

export default function Soporte() {
  return (
    <div className="min-h-screen bg-slate-300 flex justify-center items-center p-4">
      <div className="w-full max-w-[380px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 h-[820px] relative flex flex-col">
        
        {/* Fondo con imagen difuminada */}
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('./src/assets/imagenes de fondo/imagendefondo (1).png')" }}>
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        </div>

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/metroapp" element={<Metroapp />} />
          <Route path="/actualizardatos" element={<Actualizaciondedatos />} />
          <Route path="/recarga" element={<Recarga />} />
          <Route path="/pasarsaldo" element={<Pasarsaldo />} />
          <Route path="/masservicios" element={<Masservicios />} />
          <Route path="/metropay" element={<Metropay />} />
          <Route path="/transporte" element={<Transporte />} />
          <Route path="/tarjetametro" element={<Tarjetametro />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/Tarifas" element={<Tarifas />} />
          <Route path="/Horarios" element={<Horarios />} />
        </Routes>
      </div>
    </div>
  );
}