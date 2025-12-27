
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react';

export default function Pasarsaldo() {
  const navigate = useNavigate();
//preguntas frecuentes
  const preguntas = [
    "¿Como puedo pasar saldo a otra tarjeta?",
    "¿Pase saldo a otra tarjeta y no se visualiza?",
    "¿Puedo pasar saldo a cualquier tarjeta?",
    "¿Que puedo hacer si paso saldo a una cuenta equivocada?"
  ];

  return (
    <div className="relative z-10 flex flex-col h-full w-full">
      {/* Encabezado Rojo */}
      <header className="bg-[#E30613] text-white p-6 pt-14 flex items-center shadow-lg">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <ChevronLeft size={28} />
        </button>
        <h1 className="flex-1 text-center text-3xl font-extrabold capitalize tracking-tight">
          Pasar saldo
        </h1>
      </header>

      <main className="p-6 flex-1 overflow-y-auto flex flex-col bg-white/10">
        <h2 className="text-black text-xl font-extrabold mb-6 text-center italic">
          ¿Cómo podemos ayudarte?
        </h2>
        
        {/* Buscador con lupa */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 mb-6 pb-1">
          <span className="font-extrabold text-xl text-gray-800">Buscar</span>
          <Search size={22} className="text-gray-700" />
        </div>

        {/* Lista de Preguntas con flechas rojas */}
        <div className="flex flex-col mb-20">
          {preguntas.map((texto, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-300">
              <span className="text-[14px] font-extrabold text-gray-800 pr-4 leading-tight italic">
                {texto}
              </span>
              <ChevronRight className="text-[#E30613]" size={24} />
            </div>
          ))}
        </div>

        {/* Botón de Contacto y Mascota Robot */}
        <div className="mt-auto relative pb-8">
          <button className="w-full bg-[#E30613] text-white font-extrabold py-5 px-6 rounded-2xl text-left flex items-center shadow-xl">
            Llamanos o Escribenos
          </button>
          <div 
            className="absolute -right-3 -top-10 w-27 h-39 bg-contain bg-no-repeat" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
      </main>
    </div>
  );
}