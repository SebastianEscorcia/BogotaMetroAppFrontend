
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Se agregó PhoneCall a la importación para evitar el error de pantalla blanca
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react'; 

export default function Tarifas() {
  const navigate = useNavigate();
  const opciones = [
    "Recargar con PSE", 
    "Recargar a un compañer@", 
    "Verificar información de recargar",
    "En cuanto se refleja mi recarga", 
    "Existen puntos físicos de recarga", 
    "Mi saldo no se ha actualizado"
  ];

  return (
    <div className="relative z-10 flex flex-col h-full w-full">
      <header className="bg-[#E30613] text-white p-4 pt-12 flex items-center shadow-md">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <ChevronLeft size={30} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-extrabold">Tarifas</h1>
      </header>

      <main className="p-6 flex-1 flex flex-col overflow-y-auto">
        <h2 className="text-black text-xl font-extrabold mb-6 text-center italic">
          ¿Cómo podemos ayudarte?
        </h2>

        {/* Buscador */}
        <div className="flex items-center justify-between border-b-2 border-gray-700 mb-6 pb-1">
          <span className="font-extrabold text-xl text-gray-700">Buscar</span>
          <Search size={22} className="text-gray-700" />
        </div>

        {/* Lista de opciones */}
        <div className="flex flex-col mb-10">
          {opciones.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-400/50">
              <span className="text-[14px] font-extrabold text-gray-800 italic">{item}</span>
              <ChevronRight className="text-[#E30613]" size={24} strokeWidth={3} />
            </div>
          ))}
        </div>

        {/* Botón Inferior con Icono y Mascota corregido */}
        <div className="mt-auto relative pb-6">
          <button 
            className="w-full bg-[#E30613] text-white font-extrabold py-4 px-6 rounded-2xl text-left flex items-center shadow-xl text-lg italic"
          >
            <PhoneCall className="mr-3" size={24} /> 
            Llamanos o Escribenos
          </button>
          
          {/* Mascota Robot */}
          <div 
            className="absolute -right-8 -top-12 w-27 h-39 bg-contain bg-no-repeat drop-shadow-lg" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
      </main>
    </div>
  );
}