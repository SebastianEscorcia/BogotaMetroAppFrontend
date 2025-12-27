
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react';

export default function Mapas() {
  const navigate = useNavigate();

  const opcionesMapas = [
    "¿lugares cercanos?",
    "Mapa red Metro",
    "Mapa rutas integradas"
  ];

  return (
    <div className="relative z-10 flex flex-col h-full w-full bg-white/10 backdrop-blur-sm">
      <header className="bg-[#E30613] text-white p-5 pt-12 flex items-center shadow-lg">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <ChevronLeft size={32} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-extrabold tracking-tight">
          Mapas
        </h1>
      </header>

      <main className="p-6 flex-1 overflow-y-auto flex flex-col">
        <h2 className="text-black text-xl font-extrabold mb-8 text-center italic">
          ¿Cómo podemos ayudarte?
        </h2>
        
        <div className="flex items-center justify-between border-b-2 border-gray-800 mb-8 pb-1">
          <span className="font-extrabold text-xl text-gray-800">Buscar</span>
          <Search size={24} className="text-gray-800" />
        </div>

        <div className="flex flex-col mb-20">
          {opcionesMapas.map((texto, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-400/50 cursor-pointer">
              <span className="text-[15px] font-extrabold text-gray-900 pr-4 leading-tight italic">
                {texto}
              </span>
              <ChevronRight className="text-[#E30613]" size={28} strokeWidth={3} />
            </div>
          ))}
        </div>

        <div className="mt-auto relative pb-6">
          <button className="w-full bg-[#E30613] text-white font-extrabold py-4 px-6 rounded-2xl text-left flex items-center shadow-xl text-lg italic">
            <PhoneCall className="mr-3" size={24} /> 
            Llamanos o Escribenos
          </button>
          <div className="absolute -right-8 -top-12 w-28 h-39 bg-contain bg-no-repeat" style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}></div>
        </div>
      </main>
    </div>
  );
}