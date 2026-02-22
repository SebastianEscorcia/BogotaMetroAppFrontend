
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Se incluye PhoneCall para el botón inferior 
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react';

export default function Actualizaciondedatos() {
  const navigate = useNavigate();

  // Lista exacta de preguntas 
  const preguntas = [
    "No guarda mis datos nuevos",
    "No logro modificar mi correo",
    "¿Cuanto tarda en actualizar mis datos?",
    "¿puedo incluir datos de terceros?",
    "¿No me llega el correo para recuperar mi contraseña?"
  ];

  return (
    <div className="relative z-10 flex flex-col h-full w-full bg-white/10 backdrop-blur-sm">
      {/* Cabecera Roja con flecha de retorno */}
      <header className="bg-[#E30613] text-white p-4 pt-12 flex items-center shadow-lg">
        <button onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80">
          <ChevronLeft size={32} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-extrabold tracking-tight">
          Actualizacion de datos
        </h1>
      </header>

      <main className="p-6 flex-1 overflow-y-auto flex flex-col">
        {/* Título de ayuda */}
        <h2 className="text-black text-xl font-extrabold mb-8 text-center italic">
          ¿Cómo podemos ayudarte?
        </h2>
        
        {/* Buscador con línea oscura */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 mb-8 pb-1">
          <span className="font-extrabold text-xl text-gray-800">Buscar</span>
          <Search size={24} className="text-gray-800" />
        </div>

        {/* Listado de preguntas con flechas rojas */}
        <div className="flex flex-col mb-20">
          {preguntas.map((texto, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-4 border-b border-gray-400/50 cursor-pointer active:bg-white/30 transition-all"
            >
              <span className="text-[15px] font-extrabold text-gray-900 pr-4 leading-tight italic">
                {texto}
              </span>
              <ChevronRight className="text-[#E30613]" size={28} strokeWidth={3} />
            </div>
          ))}
        </div>

        {/* Botón de Contacto con PhoneCall y Mascota */}
        <div className="mt-auto relative pb-6">
          <button 
            className="w-full bg-[#E30613] text-white font-extrabold py-4 px-6 rounded-2xl text-left flex items-center shadow-xl text-lg italic"
          >
            <PhoneCall className="mr-3" size={24} /> 
            llamanos o Escribenos
          </button>
          
          {/* Mascota Robot  */}
          <div 
            className="absolute -right-7 -top-12 w-27 h-39 bg-contain bg-no-repeat drop-shadow-lg z-20" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
      </main>
    </div>
  );
}