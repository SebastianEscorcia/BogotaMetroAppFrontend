
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react';

export default function Metroapp() {
  const navigate = useNavigate();

  // Lista de preguntas extraída de tu imagen de referencia
  const preguntas = [
    "¿Como descargo la Metro App?",
    "¿Que puedo hacer en la Metro App?",
    "¿Cambio de clave?",
    "¿Cambio de correo?",
    "¿Como personalizo la APP ?",
    "¿Metro App funciona en toda colombia ?",
    "¿Puedo usar wifi en la estación ?",
    "¿Puedo usar wifi en la red Metro ?",
    "Solicita la certificado de METROPay",
    "Olvido la clave",
    "Me aparece un aviso \"En este momento no podemos continuar\"",
    "Bloqueo de cuenta"
  ];

  return (
    <div className="relative z-10 flex flex-col h-full w-full overflow-hidden bg-white/20 backdrop-blur-sm">
      {/* Cabecera Roja */}
      <header className="bg-[#E30613] text-white p-4 pt-12 flex items-center shadow-md">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <ChevronLeft size={32} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-extrabold tracking-tight">
          Metro App
        </h1>
      </header>

      <main className="p-5 flex-1 overflow-y-auto flex flex-col">
        {/* Título de sección */}
        <h2 className="text-black text-xl font-extrabold mb-7 text-center italic">
          ¿Cómo podemos ayudarte?
        </h2>
        
        {/* Buscador */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 mb-6 pb-1">
          <span className="font-extrabold text-xl text-gray-800">Buscar</span>
          <Search size={24} className="text-gray-800" />
        </div>

        {/* Lista de Preguntas con flechas rojas */}
        <div className="flex flex-col mb-16">
          {preguntas.map((texto, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-3 border-b border-gray-400/50 cursor-pointer active:bg-white/40 transition-all"
            >
              <span className="text-[15px] font-extrabold text-gray-900 pr-4 leading-tight italic">
                {texto}
              </span>
              <ChevronRight className="text-[#E30613]" size={28} strokeWidth={3} />
            </div>
          ))}
        </div>

        {/* Botón de Contacto y Mascota Robot */}
        <div className="mt-auto relative pb-8">
          <button 
            className="w-full bg-[#E30613] text-white font-extrabold py-5 px-6 rounded-2xl text-left flex items-center shadow-xl"
          >
            <PhoneCall className="mr-3" size={24} />
            Llamanos o Escribenos
          </button>
          
          {/* Mascota Robot posicionada a la derecha */}
          <div 
            className="absolute -right-5 -top-11 w-28 h-40 bg-contain bg-no-repeat drop-shadow-lg" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
      </main>
    </div>
  );
}