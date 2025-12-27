
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react';

export default function Masservicios() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex flex-col h-full w-full bg-white/10 backdrop-blur-sm">
      <header className="bg-[#E30613] text-white p-4 pt-12 flex items-center">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <ChevronLeft size={30} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-extrabold">Mas servicios</h1>
      </header>

      <main className="p-6 flex-1 flex flex-col">
        <h2 className="text-black text-xl font-extrabold mb-8 text-center italic">
          ¿Cómo podemos ayudarte?
        </h2>
        
        <div className="flex items-center justify-between border-b-2 border-gray-700 mb-8 pb-1">
          <span className="font-extrabold text-xl text-gray-700">Buscar</span>
          <Search size={22} className="text-gray-700" />
        </div>

        {/* Opción única según tu diseño actual */}
        <div className="flex items-center justify-between py-4 border-b border-gray-400/50">
          <span className="text-[15px] font-extrabold text-gray-800 italic">Turismo</span>
          <ChevronRight className="text-[#E30613]" size={26} strokeWidth={3} />
        </div>

        <div className="mt-auto relative pb-6">
          <button className="w-full bg-[#E30613] text-white font-extrabold py-4 px-6 rounded-2xl text-left shadow-xl">
            llamanos o Escribenos
          </button>
          <div 
            className="absolute -right-2 -top-13 w-28 h-39 bg-contain bg-no-repeat" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
      </main>
    </div>
  );
}